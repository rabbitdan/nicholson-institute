# TODO

Gathered from `TODO` comments in the repo. Update the comment and this list together.

## Studio

- [studio/schemaTypes/documents/collectionItem.ts:38](studio/schemaTypes/documents/collectionItem.ts#L38): `date`, `author` and `audioFiles` are derived from the design, not the spreadsheet. Revisit them when the exhibits spreadsheet arrives.
- [studio/schemaTypes/documents/collectionItem.ts:58](studio/schemaTypes/documents/collectionItem.ts#L58): a translated item must point at the translated tag documents. The translation script has to create the tags and rewrite these references.

## Scripts

- [scripts/translations.js:29](scripts/translations.js#L29): fill in `GLOSSARY` once the museum has a list of preferred terms.

## Web

- [web/astro.config.mjs:7](web/astro.config.mjs#L7): English only for now. The home page is `/en/`.
- [web/src/components/SiteHeader.vue:19](web/src/components/SiteHeader.vue#L19): a language without a translation of this page is a 404. Hide it once we know which exist.
- [web/src/components/SiteHeader.vue:24](web/src/components/SiteHeader.vue#L24): build the language list from the translation links of the current page, not a fixed list.
- [web/src/components/SiteHeader.vue:31](web/src/components/SiteHeader.vue#L31), [SiteFooter.vue:23](web/src/components/SiteFooter.vue#L23), [blocks/CtaButton.astro:4](web/src/components/blocks/CtaButton.astro#L4): collection index and event pages may need their own routes.
- [web/src/components/SiteHeader.vue:133](web/src/components/SiteHeader.vue#L133): colour mode switch. Not ported yet; it depended on Nuxt UI's `useColorMode`.
- [web/src/components/SiteHeader.vue:163](web/src/components/SiteHeader.vue#L163): the logo artwork is black only. Until a dark-mode version is supplied it gets a white backing so it stays visible. Never recolour it.
- [web/src/components/PageView.astro:16](web/src/components/PageView.astro#L16): sector colour (`page.sector`) once the sector colours are set up in the frontend.
- [web/src/components/PageView.astro:24](web/src/components/PageView.astro#L24): `collectionHighlight` and `eventList` blocks. They are skipped for now.
- Translation notice: translations are AI-produced and the site should say so. Not built yet (from `CLAUDE.md`).
