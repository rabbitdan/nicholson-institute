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
