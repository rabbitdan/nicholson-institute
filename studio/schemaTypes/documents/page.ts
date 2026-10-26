import {defineArrayMember, defineField, defineType} from 'sanity'
import {imageField, languageField, sectorField, slugField} from '../fields'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    languageField,
    defineField({name: 'title', type: 'string', validation: (rule) => rule.required()}),
    slugField,
    imageField('hero', 'Hero image (optional)'),
    sectorField,
    defineField({
      name: 'content',
      type: 'array',
      of: [
        defineArrayMember({type: 'richText'}),
        defineArrayMember({type: 'imageBlock'}),
        defineArrayMember({type: 'callout'}),
        defineArrayMember({type: 'ctaButton'}),
        defineArrayMember({type: 'collectionHighlight'}),
        defineArrayMember({type: 'eventList'}),
      ],
    }),
    defineField({name: 'seo', type: 'seo'}),
  ],
  preview: {
    select: {title: 'title', subtitle: 'language', media: 'hero'},
  },
})
