# studio

Sanity Studio for The Nicholson Institute. Content schema only.

## Schema conventions
- One schema per file in `schemaTypes/`, with an index that exports them all.
- Plain field names. Add `title` and `description` where the purpose isn't obvious.
- Every document type has a `preview`.
- Validation limited to required/min/max, plus the slug rule below.
- Every image has required alt text.
- Slugs generated from the title.
- Verify before finishing: run the type check and `sanity schema validate` if available, and fix errors.

## Domain notes
- Three sectors: Generic, Museum / Art Gallery, Library. Store `generic`, `museum` or `library` in a `sector` radio field. Never store colours.
- The "square" brand device is modelled as a `callout` block.
- Source of truth for collection records is the exhibits spreadsheet CSV in `./data/`. Derive fields from its real columns.
- The collection index page is searchable and filterable on the frontend. Filter facets come from structured fields on `collectionItem`, so avoid free-text where a small repeated set of values exists.

## Translation
- Document-level translation: one document per language, linked by `@sanity/document-internationalization`. This is the only plugin allowed. Check its current docs and compatibility with the installed Studio version before installing. If incompatible, stop and report. Do not guess its config.
- Languages: `en` (source), `de`, `ja`. Define them in one place so adding a language is a one-line change.
- Applies to: page, event, collectionItem, collectionIndex.
- Translated: titles, descriptions, rich text, image alt text and captions, button labels, SEO fields.
- Not translated (same value in every language): sector, slug, accession number, dates, booking URL, image assets.
- Slug is identical across languages. Language appears in the URL path on the frontend. The default slug uniqueness check may flag this, so scope uniqueness to language. Verify that behaviour rather than assume.
- Keep fields flat and plain so a script can translate them: avoid deep nesting, keep rich text restricted.
- The translation script lives in `../scripts/translations.js`, not in this folder. It creates drafts, not published documents, and reads the field lists it translates from its own `TRANSLATED_FIELDS`: keep it in step with schema changes.

## Out of scope for now
- Import scripts.
- Frontend code.