import {defineField, defineType} from 'sanity'

export const eventList = defineType({
  name: 'eventList',
  title: 'Event list',
  type: 'object',
  description: 'Shows upcoming events. The frontend decides which events are upcoming.',
  fields: [
    defineField({name: 'heading', type: 'string'}),
    defineField({
      name: 'sector',
      title: 'Only show events from',
      description: 'Leave empty to show events from all sectors.',
      type: 'string',
      options: {
        list: [
          {title: 'Generic', value: 'generic'},
          {title: 'Museum / Art Gallery', value: 'museum'},
          {title: 'Library', value: 'library'},
        ],
      },
    }),
    defineField({
      name: 'limit',
      title: 'Number of events',
      type: 'number',
      initialValue: 3,
      validation: (rule) => rule.required().min(1).max(12),
    }),
  ],
  preview: {
    select: {title: 'heading', sector: 'sector'},
    prepare: ({title, sector}) => ({
      title: title || 'Event list',
      subtitle: sector ? `Sector: ${sector}` : 'All sectors',
    }),
  },
})
