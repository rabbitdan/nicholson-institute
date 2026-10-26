import {defineField, defineType} from 'sanity'
import {altTextField} from '../fields'

export const imageBlock = defineType({
  name: 'imageBlock',
  title: 'Image',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      type: 'image',
      options: {hotspot: true},
      fields: [altTextField],
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'caption', type: 'string'}),
  ],
  preview: {
    select: {title: 'caption', alt: 'image.alt', media: 'image'},
    prepare: ({title, alt, media}) => ({title: title || alt || 'Image', subtitle: 'Image', media}),
  },
})
