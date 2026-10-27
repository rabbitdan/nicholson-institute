<script setup lang="ts">
import { computed } from 'vue'
// Astro imports images as { src, width, height }, so the template uses `.src`.
import logo from '../assets/images/nicholson-logo-white.png'
import type { FOOTER_QUERY_RESULT } from '../../sanity.types'

// One link in the footer, from the generated query result.
type NavLink = NonNullable<NonNullable<FOOTER_QUERY_RESULT>['navigation']>[number]

// The data is fetched in the Astro layout and passed in as a prop.
const props = defineProps<{
  footer: FOOTER_QUERY_RESULT
  language: string
}>()

// The address field is one block of text. A blank line separates the
// museum name from the street address.
const addressParts = computed(() => {
  const [name = '', ...rest] = (props.footer?.address ?? '').split(/\n\s*\n/)
  return { name: name.split('\n'), lines: rest.join('\n').split('\n').filter(Boolean) }
})

// TODO: collection index and event pages may need their own routes.
function linkTo(link: NavLink) {
  return link.linkType === 'external' ? link.url ?? '' : `/${props.language}/${link.slug}`
}
</script>

<template>
  <footer
    v-if="footer"
    class="site-footer monsterrat-400"
  >
  <div class="row">
  <a
      :href="`/${language}`"
      class="logo"
    >
      <img
        :src="logo.src"
        alt="The Nicholson Institute: Museum, Art Gallery. Home"
        width="1391"
        height="702"
      >
    </a>

    <nav aria-label="Footer">
      <ul class="link-list">
        <li
          v-for="link in footer.navigation"
          :key="link.label"
        >
          <a :href="linkTo(link)">{{ link.label }}</a>
        </li>
      </ul>
    </nav>

    <nav aria-label="Legal">
      <ul class="link-list">
        <li
          v-for="link in footer.legalLinks"
          :key="link.label"
        >
          <a :href="linkTo(link)">{{ link.label }}</a>
        </li>
      </ul>
    </nav>

    <address class="address">
      <p class="name">
        <template
          v-for="line in addressParts.name"
          :key="line"
        >
          {{ line }}<br>
        </template>
      </p>
      <p>
        <template
          v-for="line in addressParts.lines"
          :key="line"
        >
          {{ line }}<br>
        </template>
      </p>
    </address>
    </div>
    <p class="translation-disclaimer">Please note: Translations are produced by AI</p>
  </footer>
</template>

<style scoped>
/* White on Brick is very high contrast (about 14:1, to be recorded in docs/contrast.md). */
.site-footer {
  background: var(--brick);
  color: var(--white);
  padding: 2rem;
}
.site-footer .row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  align-items: center;
  gap: 2rem;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5;
  margin: 0 0 2rem 0;
}

/* Logo is wider than the other columns in the design. */
.logo {
  display: block;
  max-width: 32rem;
}

.logo img {
  display: block;
  width: 100%;
  height: auto;
}

.link-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.link-list a {
  display: inline-block;
  padding: 0.5rem 0;
  color: inherit;
  text-decoration: none;
}

.link-list a:hover {
  text-decoration: none;
  text-underline-offset: 0.25em;
}

.address {
  font-style: normal;
}

.address p {
  margin: 0;
}

.address .name {
  margin-block-end: 1.5rem;
  font-size: 1.25rem;
}

.logo:focus-visible,
.link-list a:focus-visible {
  outline: 3px solid #fff;
  outline-offset: 3px;
}

.translation-disclaimer {
  display: block;
  font-size: 0.75rem;
  font-style: italic;
  margin-top: 1rem;
  width: 100%;
}
</style>
