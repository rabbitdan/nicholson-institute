import {defineField, defineType} from 'sanity'

export const navLink = defineType({
  name: 'navLink',
  title: 'Navigation link',
  type: 'object',
  fields: [
    defineField({name: 'label', type: 'string', validation: (rule) => rule.required().max(30)}),
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
    // Hidden fields are not validated, so each is only required when it is shown.
    defineField({
      name: 'internal',
      title: 'Page',
      type: 'reference',
      to: [{type: 'page'}, {type: 'collectionIndex'}, {type: 'event'}],
      hidden: ({parent}) => parent?.linkType !== 'internal',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      hidden: ({parent}) => parent?.linkType !== 'external',
      validation: (rule) => rule.required().uri({scheme: ['http', 'https']}),
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'linkType'},
  },
})
