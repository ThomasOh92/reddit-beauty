import {defineField, defineType} from 'sanity'

export const sourceLinkObject = defineType({
  name: 'sourceLink',
  title: 'Source / Citation',
  type: 'object',
  fields: [
    defineField({name: 'title', type: 'string'}),
    defineField({name: 'publisher', type: 'string'}),
    defineField({name: 'url', type: 'url', validation: (R)=>R.uri({scheme: ['https']})}),
    defineField({name: 'rel', type: 'array', of: [{type: 'string'}], options: {list: ['nofollow','sponsored','ugc']}}),
  ],
})
