import {defineField, defineType} from 'sanity'

export const faqItemObject = defineType({
  name: 'faqItem',
  title: 'FAQ Item',
  type: 'object',
  fields: [
    defineField({name: 'question', title: 'Question', type: 'string', validation: (R)=>R.required()}),
    defineField({name: 'answer', title: 'Answer', type: 'text', rows: 5, validation: (R)=>R.required()}),
  ],
})
