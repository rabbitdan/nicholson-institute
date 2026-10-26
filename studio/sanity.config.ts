import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {documentInternationalization} from '@sanity/document-internationalization'
import {schemaTypes} from './schemaTypes'
import {languages, translatedTypes} from './schemaTypes/languages'

export default defineConfig({
  name: 'default',
  title: 'ni-data',

  projectId: 'aula8su2',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(),
    documentInternationalization({
      supportedLanguages: languages,
      schemaTypes: translatedTypes,
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
