import {defineArrayMember, defineField, defineType} from 'sanity'
import {imageField} from '../fields'

// One tile of the home page hero grid: an image and some text, linking to a page or elsewhere.
export const homeHeroItem = defineType({
  name: 'homeHeroItem',
  title: 'Hero tile',
  type: 'object',
  fields: [
    defineField({name: 'heading', type: 'string', validation: (rule) => rule.required().max(40)}),
    defineField({name: 'text', type: 'text', rows: 2, validation: (rule) => rule.max(120)}),
    {...imageField('image', 'Image'), validation: (rule) => rule.required()},
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
    select: {title: 'heading', subtitle: 'text', media: 'image'},
  },
})

// The home page hero: a grid of exactly four linked tiles.
export const homeHero = defineType({
  name: 'homeHero',
  title: 'Home hero',
  type: 'object',
  fields: [
    defineField({
      name: 'items',
      title: 'Tiles',
      type: 'array',
      of: [defineArrayMember({type: 'homeHeroItem'})],
      validation: (rule) => rule.required().length(4),
    }),
  ],
  preview: {
    prepare: () => ({title: 'Home hero', subtitle: 'Four linked tiles'}),
  },
})
