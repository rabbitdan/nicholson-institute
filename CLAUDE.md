# Nicholson Institute website

A small local library, museum and art gallery. One git repo, three independent folders. No workspace tooling.

- `studio/`: Sanity Studio (content and schema). Has its own `package.json`.
- `scripts/`: Node scripts that work on the Sanity dataset. Has its own `package.json`. Currently just `translations.js` (see Languages).
- `web/`: Astro frontend (with Vue components via `@astrojs/vue`). Has its own `package.json`. It was previously a Nuxt app, archived as `web-nuxt-version.zip` at the repo root. Do not extract or use it unless asked.

## Working rules
- Simple and readable beats clever. Boring code that scales.
- Follow what is already in the repo. Check before assuming.
- Do not add dependencies without asking.
- Do not invent requirements. Ask, or leave a short TODO.
- If you don't know something, say so. Don't proceed as if you do.
- Node 22 is pinned per folder with Volta. Do not change it.

## How the halves relate
- When a schema field changes in `studio/`, the GROQ queries in `web/` must be updated in the same piece of work.
- Sector colours (blue, red, green) live in the frontend only. The CMS stores `generic`, `museum` or `library`.

## Languages
- English is the source. German (`de`) and Japanese (`ja`) will be the first languages. More may follow.
- Translations are produced by `scripts/translations.js`, which translates the published English documents with Claude and writes `de` and `ja` documents to Sanity. It creates drafts and is run by hand: `cd scripts && npm run translate -- --dry-run` first. Options: `--lang`, `--type`, `--id`, `--dry-run`. Needs `ANTHROPIC_API_KEY` and `SANITY_WRITE_TOKEN` in `scripts/.env` (not committed; see `.env.example`).
- When a translatable field is added or changed in `studio/`, update `TRANSLATED_FIELDS` (and `MAX_LENGTH` if the field has a max) in the script in the same piece of work. The language list is duplicated there from `studio/schemaTypes/languages.ts`; change both.
- The script skips documents that already have a translation, so edited English content is not re-translated automatically. Delete the old translation, and its entry in the `translation.metadata` document, then re-run.
- Translations are AI-produced and the site should say so. TODO: the notice is not built yet (frontend).