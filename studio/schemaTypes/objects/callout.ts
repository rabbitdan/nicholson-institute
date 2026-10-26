import {defineField, defineType} from 'sanity'
import {imageField} from '../fields'

// The "square" brand device: short key information, optionally with an image.
export const callout = defineType({
  name: 'callout',
  title: 'Callout',
  type: 'object',
  fields: [
    defineField({name: 'heading', type: 'string', validation: (rule) => rule.required().max(60)}),
    defineField({name: 'text', type: 'text', rows: 3, validation: (rule) => rule.required().max(200)}),
    imageField('image', 'Image (optional)'),
  ],
  preview: {
    select: {title: 'heading', subtitle: 'text', media: 'image'},
  },
})
