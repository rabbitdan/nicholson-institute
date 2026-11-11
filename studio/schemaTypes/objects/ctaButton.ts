import {defineField, defineType} from 'sanity'

export const ctaButton = defineType({
  name: 'ctaButton',
  title: 'Button',
  type: 'object',
  fields: [
    defineField({name: 'label', type: 'string', validation: (rule) => rule.required().max(40)}),
    defineField({
      name: 'linkType',
      title: 'Links to',
      type: 'string',
      options: {
        list: [
          {title: 'A page on this site', value: 'internal'},
          {title: 'An external website', value: 'external'},
        ],
        layout: 'radio',
      },
      initialValue: 'internal',
      validation: (rule) => rule.required(),
    }),
    // The CLI validator ignores `hidden`, so each field is made required only for its own link type.
    defineField({
      name: 'internal',
      title: 'Page',
      type: 'reference',
      to: [{type: 'page'}, {type: 'collectionIndex'}, {type: 'event'}, {type: 'legalPage'}],
      hidden: ({parent}) => parent?.linkType !== 'internal',
      validation: (rule) =>
        rule.custom((value, {parent}) =>
          (parent as {linkType?: string})?.linkType === 'internal' && !value ? 'Required' : true,
        ),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      hidden: ({parent}) => parent?.linkType !== 'external',
      validation: (rule) =>
        rule
          .uri({scheme: ['http', 'https']})
          .custom((value, {parent}) =>
            (parent as {linkType?: string})?.linkType === 'external' && !value ? 'Required' : true,
          ),
    }),
  ],
  preview: {
    select: {title: 'label'},
    prepare: ({title}) => ({title, subtitle: 'Button'}),
  },
})
