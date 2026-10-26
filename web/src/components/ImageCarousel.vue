<script setup lang="ts">
import { ref } from 'vue'
import type { COLLECTION_ITEM_QUERY_RESULT } from '../../sanity.types'

defineProps<{
  images: NonNullable<COLLECTION_ITEM_QUERY_RESULT>['images']
}>()

const current = ref(0)
</script>

<template>
  <div
    v-if="images.length"
    class="carousel"
  >
    <img
      class="main-image"
      :src="`${images[current].url}?w=1546&auto=format`"
      :alt="images[current].alt"
    />
    <ul
      v-if="images.length > 1"
      class="thumbnails"
    >
      <li
        v-for="(image, index) in images"
        :key="image.url"
      >
        <button
          type="button"
          class="thumbnail"
          :aria-label="`Show image ${index + 1} of ${images.length}`"
          :aria-pressed="index === current"
          @click="current = index"
        >
          <img
            :src="`${image.url}?w=200&h=200&fit=crop&auto=format`"
            :alt="image.alt"
          />
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.main-image {
  display: block;
  width: 100%;
  aspect-ratio: 773 / 913;
  object-fit: cover;
}

.thumbnails {
  display: flex;
  flex-wrap: wrap;
  gap: 27px;
  margin: 24px 0 0;
  padding: 0;
  list-style: none;
}

.thumbnail {
  display: block;
  width: 100px;
  height: 100px;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
}

.thumbnail img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail[aria-pressed='true'] {
  outline: 4px solid var(--brick);
  outline-offset: 2px;
}

.thumbnail:focus-visible {
  outline: 4px solid var(--black);
  outline-offset: 2px;
}
</style>
