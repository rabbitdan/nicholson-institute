import {defineField, type SlugIsUniqueValidator} from 'sanity'

// Fields shared by several document types.

// Written by @sanity/document-internationalization. Not edited by hand.
export const languageField = defineField({
  name: 'language',
  type: 'string',
  readOnly: true,
  hidden: true,
})

// Stores generic, museum or library. Colours live in the frontend only.
export const sectorField = defineField({
  name: 'sector',
  type: 'string',
  options: {
    list: [
      {title: 'Generic', value: 'generic'},
      {title: 'Museum / Art Gallery', value: 'museum'},
      {title: 'Library', value: 'library'},
    ],
    layout: 'radio',
  },
  initialValue: 'generic',
  validation: (rule) => rule.required(),
})

export const altTextField = defineField({
  name: 'alt',
  title: 'Alt text',
  description: 'Describe the image for people who cannot see it.',
  type: 'string',
  validation: (rule) => rule.required(),
})

// The same slug is used in every language, so uniqueness is checked within one language.
const isUniqueInLanguage: SlugIsUniqueValidator = async (slug, context) => {
  const {document, getClient} = context
  if (!document) return true
  const client = getClient({apiVersion: '2025-02-19'})
  const id = document._id.replace(/^drafts\./, '')
  const params = {
    draft: `drafts.${id}`,
    published: id,
    type: document._type,
    language: document.language ?? null,
    slug,
  }
  const query = `!defined(*[_type == $type && !(_id in [$draft, $published]) && slug.current == $slug && language == $language][0]._id)`
  return client.fetch(query, params)
}

export const slugField = defineField({
  name: 'slug',
  type: 'slug',
  options: {source: 'title', isUnique: isUniqueInLanguage},
  validation: (rule) => rule.required(),
})

export const imageField = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    description,
    type: 'image',
    options: {hotspot: true},
    fields: [altTextField],
  })
