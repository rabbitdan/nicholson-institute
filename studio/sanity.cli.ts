import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'aula8su2',
    dataset: 'production'
  },
  // Types for the GROQ queries in ../web. Run `npm run typegen`.
  typegen: {
    path: '../web/src/**/*.{ts,astro,vue}',
    schema: 'schema.json',
    generates: '../web/sanity.types.ts',
  },
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  deployment: {
    autoUpdates: true,
    appId: 'k4qm0ijav5w7pqe1wuku0qrm',
  }
})
