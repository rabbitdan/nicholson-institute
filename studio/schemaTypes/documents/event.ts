import {defineField, defineType} from 'sanity'
import {imageField, languageField, sectorField, slugField} from '../fields'

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    languageField,
    defineField({name: 'title', type: 'string', validation: (rule) => rule.required()}),
    slugField,
    defineField({name: 'start', type: 'datetime', validation: (rule) => rule.required()}),
    defineField({name: 'end', type: 'datetime', validation: (rule) => rule.required()}),
    defineField({name: 'location', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'description', type: 'text', rows: 5}),
    imageField('image', 'Image'),
    defineField({
      name: 'bookingUrl',
      title: 'Booking URL',
      type: 'url',
      description: 'Optional. Leave empty if no booking is needed.',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    sectorField,
    defineField({name: 'seo', type: 'seo'}),
  ],
  preview: {
    select: {title: 'title', start: 'start', language: 'language', media: 'image'},
    prepare: ({title, start, language, media}) => ({
      title,
      subtitle: [start?.slice(0, 10), language].filter(Boolean).join(' · '),
      media,
    }),
  },
  orderings: [
    {title: 'Start date, newest first', name: 'startDesc', by: [{field: 'start', direction: 'desc'}]},
  ],
})
