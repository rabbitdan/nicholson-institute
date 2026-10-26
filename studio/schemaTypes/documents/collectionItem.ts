import {defineArrayMember, defineField, defineType} from 'sanity'
import {altTextField, languageField, sectorField, slugField} from '../fields'
import {restrictedBlock} from '../objects/richText'

// STUB. The museum's exhibits spreadsheet has not arrived yet.
// Further fields (accession/ID, date or period, maker, materials, dimensions,
// location, filter facets) will be derived from the spreadsheet in a later pass.
// Do not guess those fields before then.

export const collectionItem = defineType({
  name: 'collectionItem',
  title: 'Collection item',
  type: 'document',
  fields: [
    languageField,
    defineField({name: 'title', type: 'string', validation: (rule) => rule.required()}),
    slugField,
    {...sectorField, initialValue: 'museum'},
    defineField({
      name: 'images',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [altTextField],
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'shortDescription',
      type: 'text',
      rows: 3,
      description: 'Shown in listings.',
      validation: (rule) => rule.required().max(200),
    }),
    // TODO: date, author and audioFiles are derived from the design, not the spreadsheet.
    // Revisit them when the exhibits spreadsheet arrives.
    defineField({
      name: 'date',
      type: 'date',
      description: 'Pick the full date. If only the year is known, use 1 January.',
    }),
    defineField({name: 'author', type: 'string'}),
    defineField({
      name: 'audioFiles',
      type: 'array',
      description: 'Sound files played on the item page.',
      of: [
        defineArrayMember({
          type: 'file',
          options: {accept: 'audio/*'},
          fields: [defineField({name: 'title', type: 'string'})],
        }),
      ],
    }),
    // TODO: a translated item must point at the translated tag documents.
    // The translation script has to create the tags and rewrite these references.
    defineField({
      name: 'tags',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'tag'}]})],
      description: 'Used to group items on the site.',
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'longDescription',
      type: 'array',
      of: [restrictedBlock],
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'language', media: 'images.0'},
  },
})
