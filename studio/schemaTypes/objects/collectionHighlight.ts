import {defineArrayMember, defineField, defineType} from 'sanity'

export const collectionHighlight = defineType({
  name: 'collectionHighlight',
  title: 'Collection highlight',
  type: 'object',
  fields: [
    defineField({name: 'heading', type: 'string'}),
    defineField({
      name: 'items',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'collectionItem'}]})],
      validation: (rule) => rule.required().min(1).max(6),
    }),
  ],
  preview: {
    select: {title: 'heading', items: 'items'},
    prepare: ({title, items}) => ({
      title: title || 'Collection highlight',
      subtitle: `${items?.length ?? 0} items`,
    }),
  },
})
