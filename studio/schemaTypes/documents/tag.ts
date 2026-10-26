import {defineField, defineType} from 'sanity'
import {languageField, slugField} from '../fields'

// Used to group collection items on the site. One document per language;
// keep the slug identical across languages so the frontend can group on it.
export const tag = defineType({
  name: 'tag',
  title: 'Tag',
  type: 'document',
  fields: [
    languageField,
    defineField({name: 'title', type: 'string', validation: (rule) => rule.required()}),
    slugField,
  ],
  preview: {
    select: {title: 'title', subtitle: 'language'},
  },
})
