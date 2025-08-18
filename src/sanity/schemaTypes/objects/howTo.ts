import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'howTo',
  title: 'How-To',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'How-To title',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'intro',
      title: 'Intro (optional)',
      type: 'text',
      rows: 3
    }),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      of: [{ type: 'howToStep' }],
      validation: (Rule) => Rule.min(2).required()
    }),
    // Optional SEO niceties that map to Schema.org HowTo
    defineField({ name: 'totalTime', title: 'Total time (optional, ISO 8601 e.g. PT10M)', type: 'string' }),
  ],
  preview: {
    select: { title: 'title', count: 'steps.length' },
    prepare: ({ title, count }) => ({
      title,
      subtitle: `${count || 0} step${count === 1 ? '' : 's'}`
    })
  },
  initialValue: {
    steps: [{}, {}] // nudges editors to have 2+ steps
  }
})
