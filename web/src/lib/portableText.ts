import type { CollectionItem } from '../../sanity.types'

// Minimal renderer for the restricted rich text in the schema (richText.ts):
// normal, h2, h3, bullet and numbered lists, and link annotations. No dependency needed.
type Blocks = CollectionItem['longDescription']
type Block = NonNullable<Blocks>[number]

function escapeHtml(text: string) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function renderChildren(block: Block) {
  return (block.children ?? [])
    .map((span) => {
      let html = escapeHtml(span.text ?? '')
      for (const mark of span.marks ?? []) {
        const def = block.markDefs?.find((d) => d._key === mark)
        if (def?.href) html = `<a href="${escapeHtml(def.href)}">${html}</a>`
      }
      return html
    })
    .join('')
}

export function portableTextToHtml(blocks: Blocks | undefined | null): string {
  let html = ''
  let openList: 'ul' | 'ol' | null = null

  for (const block of blocks ?? []) {
    const list = block.listItem ? (block.listItem === 'bullet' ? 'ul' : 'ol') : null

    if (openList && openList !== list) {
      html += `</${openList}>`
      openList = null
    }
    if (list) {
      if (!openList) html += `<${list}>`
      openList = list
      html += `<li>${renderChildren(block)}</li>`
      continue
    }

    const tag = block.style === 'h2' || block.style === 'h3' ? block.style : 'p'
    html += `<${tag}>${renderChildren(block)}</${tag}>`
  }

  if (openList) html += `</${openList}>`
  return html
}
