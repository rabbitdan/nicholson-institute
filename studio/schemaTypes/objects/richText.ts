import {defineArrayMember, defineField, defineType} from 'sanity'

// Restricted block: headings, lists and links only. Reused by long descriptions.
export const restrictedBlock = defineArrayMember({
  type: 'block',
  styles: [
    {title: 'Normal', value: 'normal'},
    {title: 'Heading 2', value: 'h2'},
    {title: 'Heading 3', value: 'h3'},
  ],
  lists: [
    {title: 'Bullet', value: 'bullet'},
    {title: 'Numbered', value: 'number'},
  ],
  marks: {
    decorators: [],
    annotations: [
      {
        name: 'link',
        type: 'object',
        title: 'Link',
        fields: [
          defineField({
            name: 'href',
            title: 'URL',
            type: 'url',
            validation: (rule) =>
              rule.required().uri({scheme: ['http', 'https', 'mailto', 'tel']}),
          }),
        ],
      },
    ],
  },
})

export const richText = defineType({
  name: 'richText',
  title: 'Rich text',
  type: 'object',
  fields: [
    defineField({
      name: 'body',
      type: 'array',
      of: [restrictedBlock],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {blocks: 'body'},
    prepare({blocks}) {
      const first = (blocks ?? []).find((block: {_type: string}) => block._type === 'block')
      const text = first?.children?.map((child: {text: string}) => child.text).join('') ?? ''
      return {title: text || 'Rich text', subtitle: 'Rich text'}
    },
  },
})
