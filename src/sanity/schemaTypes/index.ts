import {postType} from './postType'
import {authorType} from './authorType'
import {categoryType} from './categoryType'
import {blockContentType} from './blockContentType'

// New objects
import {seoObject} from './objects/seoObject'
import {faqItemObject} from './objects/faqItemObject'
import {sourceLinkObject} from './objects/sourceLinkObject'
import howToStepObject from './objects/howToStepObject'
import howTo from './objects/howTo' // optional

export const schema = [
  // documents
  postType,
  authorType,
  categoryType,

  // blocks/portable text
  blockContentType,

  // objects
  seoObject,
  faqItemObject,
  sourceLinkObject,
  howToStepObject,
  howTo,
]
