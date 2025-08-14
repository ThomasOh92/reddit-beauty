import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'howToStep',
  title: 'How-To Step',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Step title', type: 'string' }),
    defineField({
      name: 'body',
      title: 'Instructions',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'image',
      title: 'Image (optional)',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (Rule) => Rule.custom((val, ctx) => {
            const hasImage = !!(ctx.parent as { asset?: unknown })?.asset
            return hasImage ? (val ? true : 'Alt text required when an image is set') : true
          })
        })
      ]
    })
  ],
  preview: {
    select: { title: 'title', body0: 'body.0.children.0.text' },
    prepare: ({ title, body0 }) => ({
      title: title || body0 || 'Step',
      subtitle: 'How-To Step'
    })
  }
})
