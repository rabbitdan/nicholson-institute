import {defineField, defineType} from 'sanity'
import {altTextField} from '../fields'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'Shown in search results. Leave empty to use the page title.',
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: 'image',
      title: 'Share image',
      type: 'image',
      options: {hotspot: true},
      fields: [altTextField],
    }),
  ],
})
