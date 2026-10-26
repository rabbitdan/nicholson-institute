import {defineArrayMember, defineField, defineType} from 'sanity'
import {languageField} from '../fields'

// Site footer. One document per language.
// The main links come from the header document, so they are not repeated here.
// The logo and language switcher are not stored here (see header).
export const footer = defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  fields: [
    languageField,
    defineField({
      name: 'address',
      type: 'text',
      rows: 4,
      description: 'The museum address. One line per row, as it should appear.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'legalLinks',
      title: 'Legal links',
      description: 'For example privacy policy, cookies, accessibility.',
      type: 'array',
      of: [defineArrayMember({type: 'navLink'})],
      validation: (rule) => rule.max(6),
    }),
  ],
  preview: {
    select: {title: 'address', subtitle: 'language'},
    prepare: ({title, subtitle}) => ({
      title: 'Footer',
      subtitle: `${subtitle ?? ''} ${title?.split('\n')[0] ?? ''}`.trim(),
    }),
  },
})
