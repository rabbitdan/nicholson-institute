import {defineField, defineType} from 'sanity'
import {imageField, languageField, sectorField, slugField} from '../fields'

// Hosts the searchable, filterable collection listing.
// It does not reference items: the frontend queries collectionItem directly.
export const collectionIndex = defineType({
  name: 'collectionIndex',
  title: 'Collection index',
  type: 'document',
  fields: [
    languageField,
    defineField({name: 'title', type: 'string', validation: (rule) => rule.required()}),
    slugField,
    defineField({name: 'intro', type: 'text', rows: 4}),
    imageField('hero', 'Hero image'),
    sectorField,
    defineField({name: 'seo', type: 'seo'}),
  ],
  preview: {
    select: {title: 'title', subtitle: 'language', media: 'hero'},
  },
})
