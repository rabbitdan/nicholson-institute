import {defineField, defineType} from 'sanity'
import {languageField, slugField} from '../fields'
import {restrictedBlock} from '../objects/richText'

// Privacy policy, terms, accessibility statement and similar.
// The sidebar links in the design are built from the Heading 2s in the body, so they are not a field.
export const legalPage = defineType({
  name: 'legalPage',
  title: 'Legal page',
  type: 'document',
  fields: [
    languageField,
    defineField({name: 'title', type: 'string', validation: (rule) => rule.required()}),
    slugField,
    defineField({
      name: 'body',
      type: 'array',
      of: [restrictedBlock],
      description: 'Use Heading 2 for each section. They become the links in the sidebar.',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'pdf',
      title: 'PDF download',
      type: 'file',
      description: 'Optional. Shows the Download box next to the text.',
      options: {accept: 'application/pdf'},
    }),
    defineField({name: 'seo', type: 'seo'}),
  ],
  preview: {
    select: {title: 'title', subtitle: 'language'},
  },
})
