import { createClient } from '@sanity/client'

// Public, read-only. The dataset is public, so no token is needed.
export const sanityClient = createClient({
  projectId: 'aula8su2',
  dataset: 'production',
  apiVersion: '2025-02-19',
  useCdn: true
})
