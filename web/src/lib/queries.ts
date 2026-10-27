// Every GROQ query lives here, wrapped in defineQuery so TypeGen can type its result.
// Each query needs a unique name. Run `npm run typegen` after changing a query or the schema.
import { defineQuery } from 'groq'

export const HEADER_NAVIGATION_QUERY = defineQuery(`
  *[_type == "header" && language == $language][0].navigation[]{
    label,
    linkType,
    url,
    "slug": internal->slug.current
  }
`)

// The main links are the header's links, so they are only edited in one place.
export const FOOTER_QUERY = defineQuery(`
  *[_type == "footer" && language == $language][0]{
    address,
    "legalLinks": legalLinks[]{label, linkType, url, "slug": internal->slug.current},
    "navigation": *[_type == "header" && language == $language][0].navigation[]{
      label, linkType, url, "slug": internal->slug.current
    }
  }
`)

export const COLLECTION_ITEM_SLUGS_QUERY = defineQuery(`
  *[_type == "collectionItem" && language == $language && defined(slug.current)].slug.current
`)

// coalesce on the asset URLs so the generated types are plain strings, not string | null.
export const COLLECTION_ITEM_QUERY = defineQuery(`
  *[_type == "collectionItem" && language == $language && slug.current == $slug][0]{
    title,
    date,
    author,
    longDescription,
    "images": images[]{alt, "url": coalesce(asset->url, "")},
    "audioFiles": audioFiles[]{title, "url": coalesce(asset->url, "")}
  }
`)

// The page text for the collection index. The items themselves come from COLLECTION_ITEMS_QUERY.
export const COLLECTION_INDEX_QUERY = defineQuery(`
  *[_type == "collectionIndex" && language == $language][0]{title, intro}
`)

// First image only: the listing shows one thumbnail per item.
export const COLLECTION_ITEMS_QUERY = defineQuery(`
  *[_type == "collectionItem" && language == $language && defined(slug.current)] | order(title asc){
    title,
    "slug": slug.current,
    shortDescription,
    date,
    author,
    "tags": tags[]->{title, "slug": slug.current},
    "image": images[0]{alt, "url": coalesce(asset->url, "")}
  }
`)

// The home page is the page document with this slug. It is served at /{language}/, not /{language}/home.
export const HOME_SLUG = 'home'

// Every page document that has a slug, in the site's languages. The collection index has its own
// slug but its own route, so a page called "collection" would clash with it and is left out.
export const PAGE_PATHS_QUERY = defineQuery(`
  *[_type == "page" && language in $languages && defined(slug.current) && !(slug.current in ["collection", "home"])]{
    language,
    "slug": slug.current
  }
`)

// The languages that have a home page.
export const HOME_LANGUAGES_QUERY = defineQuery(`
  *[_type == "page" && language in $languages && slug.current == "home"].language
`)

// The blocks are projected by type. collectionHighlight and eventList only return _key and _type for now.
export const PAGE_QUERY = defineQuery(`
  *[_type == "page" && language == $language && slug.current == $slug][0]{
    title,
    sector,
    "hero": hero{alt, "url": coalesce(asset->url, "")},
    content[]{
      _key,
      _type,
      _type == "richText" => {body},
      _type == "imageBlock" => {caption, "image": image{alt, "url": coalesce(asset->url, "")}},
      _type == "callout" => {heading, text, "image": image{alt, "url": coalesce(asset->url, "")}},
      _type == "ctaButton" => {label, linkType, url, "slug": internal->slug.current}
    }
  }
`)
