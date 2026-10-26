import {defineArrayMember, defineField, defineType} from 'sanity'
import {languageField} from '../fields'

// Site header: the main navigation. One document per language.
// The logo and language switcher are not stored here: the logo is in the frontend,
// and the switcher is built from the languages list and the translation links.
export const header = defineType({
  name: 'header',
  title: 'Header',
  type: 'document',
  fields: [
    languageField,
    defineField({
      name: 'navigation',
      type: 'array',
      of: [defineArrayMember({type: 'navLink'})],
      validation: (rule) => rule.required().min(1).max(8),
    }),
  ],
  preview: {
    select: {subtitle: 'language'},
    prepare: ({subtitle}) => ({title: 'Header', subtitle}),
  },
})
