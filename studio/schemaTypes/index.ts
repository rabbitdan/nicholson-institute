import {collectionIndex} from './documents/collectionIndex'
import {collectionItem} from './documents/collectionItem'
import {event} from './documents/event'
import {footer} from './documents/footer'
import {header} from './documents/header'
import {legalPage} from './documents/legalPage'
import {page} from './documents/page'
import {tag} from './documents/tag'
import {callout} from './objects/callout'
import {collectionHighlight} from './objects/collectionHighlight'
import {ctaButton} from './objects/ctaButton'
import {eventList} from './objects/eventList'
import {homeHero, homeHeroItem} from './objects/homeHero'
import {imageBlock} from './objects/imageBlock'
import {navLink} from './objects/navLink'
import {richText} from './objects/richText'
import {seo} from './objects/seo'

export const schemaTypes = [
  // documents
  collectionItem,
  collectionIndex,
  tag,
  page,
  legalPage,
  event,
  header,
  footer,
  // page blocks
  richText,
  imageBlock,
  callout,
  ctaButton,
  collectionHighlight,
  eventList,
  homeHero,
  homeHeroItem,
  // shared
  navLink,
  seo,
]
