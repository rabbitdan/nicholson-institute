<script setup lang="ts">
import { ref } from 'vue'
// Astro imports images as { src, width, height }, so the templates use `.src`.
import logo from '../assets/images/nicholson-logo.svg'
import chevron from '../assets/images/chevron-down.svg'
import type { HEADER_NAVIGATION_QUERY_RESULT } from '../../sanity.types'

// One link in the navigation, from the generated query result.
type NavLink = NonNullable<HEADER_NAVIGATION_QUERY_RESULT>[number]

// The data is fetched in the Astro layout and passed in as a prop.
const props = defineProps<{
  navigation: HEADER_NAVIGATION_QUERY_RESULT
  language: string
  pathname: string
}>()

// Same page in another language: the language is the first segment and slugs are not translated.
function switchTo(id: string) {
  return props.pathname.replace(/^\/[^/]+/, `/${id}`)
}

const languages = [
  { id: 'en', title: 'English' },
  { id: 'de', title: 'Deutsch' },
  { id: 'ja', title: '日本語' }
]

function linkTo(link: NavLink) {
  return link.linkType === 'external' ? link.url ?? '' : `/${props.language}/${link.slug}`
}

const pickerOpen = ref(false)
const picker = ref<HTMLElement | null>(null)

function closePicker() {
  pickerOpen.value = false
}

// Close on Escape and return focus to the button, as the page rules require.
function onPickerKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape' || !pickerOpen.value) return
  closePicker()
  picker.value?.querySelector('button')?.focus()
}

// Close when focus leaves the picker.
function onPickerFocusout(event: FocusEvent) {
  if (!picker.value?.contains(event.relatedTarget as Node | null)) closePicker()
}
</script>

<template>
  <header class="site-header montserrat-400">
    <a
      :href="`/${language}`"
      class="logo"
    >
      <span class="logo-crop">
        <img
          :src="logo.src"
          alt="The Nicholson Institute: Library, Museum, Art Gallery. Home"
          width="1391"
          height="702"
        >
      </span>
    </a>

    <div class="header-right">
      <nav aria-label="Main">
        <ul class="nav-list">
          <li
            v-for="link in navigation"
            :key="link.label"
          >
            <a
              :href="linkTo(link)"
              class="nav-link"
            >{{ link.label }}</a>
          </li>
        </ul>
      </nav>

      <div
        ref="picker"
        class="picker"
        @keydown="onPickerKeydown"
        @focusout="onPickerFocusout"
      >
        <button
          type="button"
          class="picker-button"
          aria-haspopup="true"
          :aria-expanded="pickerOpen"
          aria-controls="language-list"
          @click="pickerOpen = !pickerOpen"
        >
          <span aria-hidden="true">{{ language.toUpperCase() }}</span>
          <span class="visually-hidden">Language: English. Change language</span>
          <img
            :src="chevron.src"
            alt=""
            width="25"
            height="14"
            class="chevron"
          >
        </button>

        <ul
          v-show="pickerOpen"
          id="language-list"
          class="picker-list"
        >
          <li
            v-for="item in languages"
            :key="item.id"
          >
            <a
              :href="switchTo(item.id)"
              :lang="item.id"
              :aria-current="item.id === language ? 'true' : undefined"
              class="nav-link montserrat-700"
            >
              {{ item.title }}
            </a>
          </li>
        </ul>
      </div>

      <!-- <SiteColorModeSwitch /> -->
    </div>
  </header>
</template>

<style scoped>
.site-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem 2rem;
  background: var(--page-bg);
  color: var(--page-text);
}

.logo {
  display: block;
  width: clamp(10rem, 30vw, 22rem);
}

.logo:focus-visible,
.nav-link:focus-visible,
.picker-button:focus-visible,
.picker-list a:focus-visible {
  outline: 3px solid var(--page-text);
  outline-offset: 3px;
}

:global(.dark) .logo {
  background: var(--white);
}

/* The exported logo has a little padding; this matches the crop in the design. */
.logo-crop {
  display: block;
  position: relative;
  aspect-ratio: 419 / 211;
  overflow: hidden;
}

.logo-crop img {
  position: absolute;
  left: 0.95%;
  top: -5.32%;
  width: 100%;
  height: 100.22%;
  max-width: none;
}

.header-right {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem 2.5rem;
  margin-inline-start: auto;
}

.nav-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 2.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.nav-link {
  display: inline-block;
  padding: 0.75rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: inherit;
  text-decoration: none;
  text-transform: uppercase;
}

.nav-link:hover {
  text-decoration: underline;
  text-underline-offset: 0.25em;
}

.picker {
  position: relative;
  align-self: stretch;
  display: flex;
}

.picker-button {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  min-height: 44px;
  padding: 0 1.25rem;
  border: 0;
  background: var(--blue-sky);
  color: #000;
  font: inherit;
  font-size: 1.5rem;
  font-weight: 700;
  cursor: pointer;
}

.picker-button:hover {
  text-decoration: underline;
  text-underline-offset: 0.25em;
}

.chevron {
  width: 1.5rem;
  height: auto;
}

.picker-list {
  position: absolute;
  inset-block-start: 100%;
  inset-inline-end: 0;
  z-index: 10;
  min-width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
  background: var(--blue-sky);
}

.picker-list a {
  display: block;
  padding: 0.75rem 1.25rem;
  color: #000;
  font-size: 1.25rem;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
}

.picker-list a:hover,
.picker-list a[aria-current] {
  text-decoration: underline;
  text-underline-offset: 0.25em;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

@media (prefers-reduced-motion: no-preference) {
  .nav-link,
  .picker-button {
    transition: background-color 0.15s;
  }
}
</style>
