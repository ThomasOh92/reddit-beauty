import {defineField, defineType} from 'sanity'

export const seoObject = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta title',
      type: 'string',
      validation: (Rule) => Rule.max(60).warning('Aim ≤ 60 chars'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(160).warning('Aim ≤ 160 chars'),
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      validation: (Rule) => Rule.uri({allowRelative: false, scheme: ['https']}),
    }),
    defineField({
      name: 'robots',
      title: 'Robots',
      type: 'object',
      fields: [
        {name: 'index', type: 'boolean', initialValue: true},
        {name: 'follow', type: 'boolean', initialValue: true},
        {name: 'maxSnippet', type: 'number'},
        {name: 'maxImagePreview', type: 'string', options: {list: ['none','standard','large']}},
        {name: 'maxVideoPreview', type: 'number'},
      ],
    }),
    defineField({
      name: 'ogTitle',
      title: 'OG title (override)',
      type: 'string',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'ogDescription',
      title: 'OG description (override)',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(110).warning('Shorter is better for social'),
    }),
    defineField({
      name: 'ogImage',
      title: 'OG image (1200×630)',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (R) => R.required(),
        }),
      ],
    }),
    defineField({
      name: 'twitterCard',
      title: 'Twitter Card',
      type: 'string',
      options: {list: ['summary', 'summary_large_image']},
      initialValue: 'summary_large_image',
    }),
    defineField({
      name: 'structuredData',
      title: 'Structured Data JSON-LD (advanced override)',
      description: 'Optional raw JSON that merges/overrides defaults at render time',
      type: 'text',
      rows: 10,
    }),
  ],
})
