// Translates the English content into the other site languages with Claude and
// saves the results as DRAFT documents in Sanity. Published documents are never changed.
//
//   npm run translate -- --dry-run
//   npm run translate -- --lang de --type tag
//   npm run translate -- --id <published English document id>
//
// Needs ANTHROPIC_API_KEY and SANITY_WRITE_TOKEN (an Editor token) in .env or the environment.
import {randomUUID} from 'node:crypto'
import {parseArgs} from 'node:util'
import Anthropic from '@anthropic-ai/sdk'
import {createClient} from '@sanity/client'

const MODEL = 'claude-sonnet-5-5'

// Keep in step with studio/schemaTypes/languages.ts.
const SOURCE_LANGUAGE = 'en'
const TARGET_LANGUAGES = {de: 'German', ja: 'Japanese'}
// Order matters: a document can only point at translations that already exist, so
// tags go first and header/footer (which link to pages) go last.
const TRANSLATED_TYPES = ['tag', 'collectionItem', 'event', 'collectionIndex', 'page', 'header', 'footer']

const STYLE = {
  de: 'Use the formal "Sie" form.',
  ja: 'Use the polite です/ます style.',
}

// Fixed translations for terms the model should not choose itself, e.g. {'Reading Room': 'Lesesaal'}.
// TODO: fill in once the museum has a list of preferred terms.
const GLOSSARY = {}

// Text fields to translate, by object `_type`. Everything else is copied as it is:
// sector, slug, dates, URLs, link types, image assets, author names.
const TRANSLATED_FIELDS = {
  tag: ['title'],
  collectionItem: ['title', 'shortDescription'],
  event: ['title', 'location', 'description'],
  collectionIndex: ['title', 'intro'],
  page: ['title'],
  footer: ['address'],
  seo: ['title', 'description'],
  image: ['alt'],
  file: ['title'],
  callout: ['heading', 'text'],
  imageBlock: ['caption'],
  ctaButton: ['label'],
  navLink: ['label'],
  collectionHighlight: ['heading'],
  eventList: ['heading'],
}

// The same limits as the studio validation, so translated drafts stay valid.
const MAX_LENGTH = {
  'collectionItem.shortDescription': 200,
  'callout.heading': 60,
  'callout.text': 200,
  'seo.title': 60,
  'seo.description': 160,
  'ctaButton.label': 40,
  'navLink.label': 30,
}

const SAVE_TOOL = {
  name: 'save_translations',
  description: 'Save the translated text for every id.',
  strict: true,
  input_schema: {
    type: 'object',
    properties: {
      translations: {
        type: 'array',
        items: {
          type: 'object',
          properties: {id: {type: 'string'}, text: {type: 'string'}},
          required: ['id', 'text'],
          additionalProperties: false,
        },
      },
    },
    required: ['translations'],
    additionalProperties: false,
  },
}

const {values: args} = parseArgs({
  options: {
    lang: {type: 'string'},
    type: {type: 'string'},
    id: {type: 'string'},
    'dry-run': {type: 'boolean'},
  },
})
const dryRun = args['dry-run']

const sanity = createClient({
  projectId: 'aula8su2',
  dataset: 'production',
  apiVersion: '2025-02-19',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})
// A dry run never calls Claude, so it works without an API key.
const claude = dryRun ? null : new Anthropic() // reads ANTHROPIC_API_KEY

// Collects every translatable string in `node` as {label, text, set}. Calling set(text)
// writes the translation back into the same place.
function collectTexts(node, items) {
  if (Array.isArray(node)) {
    node.forEach((child) => collectTexts(child, items))
    return
  }
  if (!node || typeof node !== 'object') return
  if (node._type === 'block') {
    collectBlock(node, items)
    return
  }
  for (const field of TRANSLATED_FIELDS[node._type] ?? []) {
    if (!node[field]) continue
    items.push({
      label: `${node._type}.${field}`,
      text: node[field],
      set: (text) => {
        node[field] = text
      },
    })
  }
  for (const [key, value] of Object.entries(node)) {
    if (key !== 'asset') collectTexts(value, items)
  }
}

// A block with a link has several spans. They are sent as <s0>..</s0><s1>..</s1> so the
// sentence is translated as a whole and the link text can be put back on the right span.
function collectBlock(block, items) {
  const spans = block.children.filter((child) => child._type === 'span')
  const text = spans.map((span) => span.text).join('')
  if (!text.trim()) return

  if (spans.length === 1) {
    items.push({label: 'block', text, set: (value) => void (spans[0].text = value)})
    return
  }
  items.push({
    label: 'block',
    text: spans.map((span, i) => `<s${i}>${span.text}</s${i}>`).join(''),
    set: (value) => {
      const parts = spans.map((_, i) => value.match(new RegExp(`<s${i}>([\\s\\S]*?)</s${i}>`))?.[1])
      if (parts.includes(undefined)) throw new Error(`Link tags were lost in: ${value}`)
      spans.forEach((span, i) => (span.text = parts[i]))
    },
  })
}

function systemPrompt(lang) {
  const glossary = Object.entries(GLOSSARY).map(([from, to]) => `${from} = ${to}`)
  return [
    `You translate website copy for the Nicholson Institute, a small local library, museum and art gallery, from English into ${TARGET_LANGUAGES[lang]}. ${STYLE[lang]}`,
    'The user message is a JSON list of {id, field, max, text}. Reply only by calling the save_translations tool, once, with every id and its translated text.',
    'Keep proper nouns, exhibit names and people\'s names as given. Do not change URLs, numbers or accession numbers. Keep line breaks. Do not add or remove information.',
    'If max is given, the translation must be no longer than that many characters.',
    'If text contains tags like <s0>..</s0>, keep every tag, in order, and translate only the text between them.',
    glossary.length ? `Glossary, always use these translations:\n${glossary.join('\n')}` : '',
  ]
    .filter(Boolean)
    .join('\n\n')
}

async function translateTexts(items, lang) {
  const input = items.map((item, i) => ({
    id: String(i),
    field: item.label,
    max: MAX_LENGTH[item.label],
    text: item.text,
  }))
  const res = await claude.messages.create({
    model: MODEL,
    max_tokens: 8000,
    system: systemPrompt(lang),
    tools: [SAVE_TOOL],
    // Forced tool_choice is rejected by this model, so the system prompt asks for the tool.
    tool_choice: {type: 'auto'},
    messages: [{role: 'user', content: JSON.stringify(input)}],
  })
  if (res.stop_reason === 'max_tokens') throw new Error('Translation was cut off: document too long')

  const saved = res.content.find((block) => block.type === 'tool_use')?.input.translations ?? []
  const byId = new Map(saved.map((entry) => [entry.id, entry.text]))
  return input.map((entry) => {
    const text = byId.get(entry.id)
    if (typeof text !== 'string') throw new Error(`No translation returned for ${entry.field}`)
    if (entry.max && text.length > entry.max) {
      console.warn(`  warning: ${entry.field} is ${text.length} characters, max ${entry.max}: ${text}`)
    }
    return text
  })
}

// Weak references to documents that only exist as drafts become strong when published,
// the same way the document-internationalization plugin does it.
function translationReference(lang, id, type) {
  return {
    _key: randomUUID().slice(0, 12),
    _type: 'internationalizedArrayReferenceValue',
    language: lang,
    value: {_type: 'reference', _ref: id, _weak: true, _strengthenOnPublish: {type}},
  }
}

// Id of the `lang` translation of a published document, from its translation.metadata.
function findTranslationId(id, lang) {
  return sanity.fetch(
    `*[_type == "translation.metadata" && references($id)][0].translations[language == $lang][0].value._ref`,
    {id, lang},
  )
}

// Points a reference at the translated document. If that document has not been
// translated yet, the reference is left pointing at the English one.
async function translateReference(ref, lang) {
  const {type} = await sanity.fetch(`{"type": *[_id == $id][0]._type}`, {id: ref._ref})
  const id = await findTranslationId(ref._ref, lang)
  if (!id) {
    console.warn(`  warning: ${type} ${ref._ref} has no ${lang} translation yet, reference left as English`)
    return ref
  }
  return {...ref, _ref: id, _weak: true, _strengthenOnPublish: {type}}
}

async function translateReferences(node, lang) {
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) node[i] = await translateReferences(node[i], lang)
    return node
  }
  if (!node || typeof node !== 'object') return node
  if (node._type === 'reference') return translateReference(node, lang)
  for (const [key, value] of Object.entries(node)) {
    if (key !== 'asset') node[key] = await translateReferences(value, lang)
  }
  return node
}

async function translateDocument(source, lang) {
  const label = `${source._type} "${source.title ?? source._id}" -> ${lang}`
  if (await findTranslationId(source._id, lang)) {
    console.log(`skip    ${label} (already translated)`)
    return
  }

  const draft = structuredClone(source)
  for (const key of ['_rev', '_createdAt', '_updatedAt']) delete draft[key]
  const items = []
  collectTexts(draft, items)

  if (dryRun) {
    console.log(`dry run ${label}: ${items.length} texts`)
    items.forEach((item) => console.log(`  ${item.label}: ${item.text}`))
    return
  }

  console.log(`works   ${label}: ${items.length} texts`)
  const texts = await translateTexts(items, lang)
  items.forEach((item, i) => item.set(texts[i]))
  await translateReferences(draft, lang)

  const translationId = randomUUID()
  draft._id = `drafts.${translationId}`
  draft.language = lang
  const newReference = translationReference(lang, translationId, source._type)

  const metadataId = await sanity.fetch(
    `*[_type == "translation.metadata" && references($id)][0]._id`,
    {id: source._id},
  )
  const transaction = sanity.transaction().create(draft)
  if (metadataId) {
    transaction.patch(metadataId, {insert: {after: 'translations[-1]', items: [newReference]}})
  } else {
    transaction.create({
      _id: randomUUID(),
      _type: 'translation.metadata',
      schemaTypes: [source._type],
      translations: [translationReference(SOURCE_LANGUAGE, source._id, source._type), newReference],
    })
  }
  await transaction.commit()
  console.log(`created ${label}`)
}

async function main() {
  const languages = args.lang ? [args.lang] : Object.keys(TARGET_LANGUAGES)
  const types = args.type ? [args.type] : TRANSLATED_TYPES
  if (languages.some((lang) => !TARGET_LANGUAGES[lang])) {
    throw new Error(`--lang must be one of: ${Object.keys(TARGET_LANGUAGES).join(', ')}`)
  }
  if (types.some((type) => !TRANSLATED_TYPES.includes(type))) {
    throw new Error(`--type must be one of: ${TRANSLATED_TYPES.join(', ')}`)
  }
  if (!dryRun && !process.env.SANITY_WRITE_TOKEN) throw new Error('SANITY_WRITE_TOKEN is not set')

  // Published English documents only: unpublished drafts are not translated.
  const documents = await sanity.fetch(
    `*[_type in $types && language == $source && !(_id in path("drafts.**")) && ($id == null || _id == $id)]`,
    {types, source: SOURCE_LANGUAGE, id: args.id ?? null},
  )
  documents.sort((a, b) => TRANSLATED_TYPES.indexOf(a._type) - TRANSLATED_TYPES.indexOf(b._type))
  console.log(`${documents.length} English documents, languages: ${languages.join(', ')}`)

  let failed = 0
  for (const source of documents) {
    for (const lang of languages) {
      try {
        await translateDocument(source, lang)
      } catch (error) {
        failed++
        console.error(`FAILED  ${source._type} ${source._id} -> ${lang}: ${error.message}`)
      }
    }
  }
  if (failed) {
    console.error(`${failed} failed`)
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
