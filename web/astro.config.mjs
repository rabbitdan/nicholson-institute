// @ts-check
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  // TODO: English only for now. The home page is /en/.
  redirects: { '/': '/en/' },
  integrations: [vue()],
});
