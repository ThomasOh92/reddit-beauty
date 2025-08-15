import {DocumentTextIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO'},
    {name: 'relations', title: 'Relations'},
    {name: 'review', title: 'Review & E-E-A-T'},
    {name: 'advanced', title: 'Advanced'},
  ],
  fields: [
    // Core
    defineField({ name: 'title', type: 'string', group: 'content', validation: (R)=>R.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96, isUnique: (slug, ctx) => ctx.defaultIsUnique(slug, ctx) },
      validation: (R)=>R.required(),
      group: 'content',
    }),
    defineField({
      name: 'author',
      type: 'reference',
      to: {type: 'author'},
      group: 'content',
      validation: (R)=>R.required(),
    }),
    defineField({
      name: 'mainImage',
      type: 'image',
      options: {hotspot: true},
      group: 'content',
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          validation: (R)=>R.required().error('Alt text is required'),
        })
      ]
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
      rows: 3,
      description: '1–2 sentence summary (fallback for meta description & list previews)',
      group: 'content',
      validation: (R)=>R.max(200),
    }),
    defineField({ name: 'body', type: 'blockContent', group: 'content', validation: (R)=>R.required() }),
    defineField({ name: 'publishedAt', type: 'datetime', group: 'content' }),
    defineField({ name: 'dateModified', type: 'datetime', group: 'content' }),
    defineField({ name: 'locale', type: 'string', initialValue: 'en-GB', group: 'advanced' }),

    // Taxonomy & Relations
    defineField({
      name: 'primaryCategory',
      title: 'Primary category',
      type: 'reference',
      to: {type: 'category'},
      group: 'relations',
      validation: (R)=>R.required(),
    }),
    defineField({
      name: 'categories',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: {type: 'category'}})],
      group: 'relations',
    }),
    defineField({
      name: 'tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      group: 'relations',
    }),
    defineField({
      name: 'relatedPosts',
      type: 'array',
      of: [{type: 'reference', to: {type: 'post'}}],
      group: 'relations',
    }),
    defineField({
      name: 'relatedLinks',
      title: 'Related links (for monetization/key pages)',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'title',
            type: 'string',
            title: 'Link title',
            validation: (R) => R.required()
          },
          {
            name: 'url',
            type: 'url',
            title: 'URL',
            validation: (R) => R.required()
          },
          {
            name: 'description',
            type: 'text',
            title: 'Description (optional)',
            rows: 2
          }
        ],
        preview: {
          select: {
            title: 'title',
            url: 'url'
          },
          prepare(selection) {
            const {title, url} = selection
            return {
              title: title,
              subtitle: url
            }
          }
        }
      }],
      group: 'relations',
    }),

    // Rich-result content
    defineField({
      name: 'faq',
      type: 'array',
      of: [{type: 'faqItem'}],
      group: 'content',
    }),
    defineField({
      name: 'howTo',
      title: 'How-To (optional — requires at least 2 steps)',
      type: 'howTo',
      group: 'content'
    }),
    defineField({
      name: 'reviewBlock',
      title: 'Review (optional)',
      type: 'object',
      group: 'content',
      fields: [
        {name: 'itemName', type: 'string', validation: (R)=>R.required()},
        {name: 'ratingValue', type: 'number', validation: (R)=>R.min(0).max(5)},
        {name: 'ratingCount', type: 'number'},
      ]
    }),

    // E-E-A-T / Sources
    defineField({
      name: 'sources',
      type: 'array',
      of: [{type: 'sourceLink'}],
      group: 'review',
    }),
    defineField({ name: 'reviewedBy', type: 'reference', to: {type: 'author'}, group: 'review' }),
    defineField({ name: 'lastReviewedAt', type: 'datetime', group: 'review' }),

    // SEO & Social
    defineField({ name: 'seo', type: 'seo', group: 'seo' }),
    defineField({ name: 'featured', type: 'boolean', group: 'seo' }),
    defineField({
      name: 'ogImage',
      title: 'OG image (preferred)',
      type: 'image',
      options: {hotspot: true},
      group: 'seo',
      fields: [{name: 'alt', type: 'string', validation: (R)=>R.required()}],
    }),

    // Redirect hygiene & misc
    defineField({
      name: 'previousSlugs',
      title: 'Previous slugs (for 301s)',
      type: 'array',
      of: [{type: 'string'}],
      group: 'advanced',
    }),
    defineField({
      name: 'readingTime',
      type: 'number',
      description: 'Minutes (override). Compute at build if empty.',
      group: 'advanced',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const {author} = selection
      return {...selection, subtitle: author && `by ${author}`}
    },
  },
})
