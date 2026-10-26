<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  src: string
  title: string
}>()

const audio = ref<HTMLAudioElement | null>(null)
const playing = ref(false)
const duration = ref(0)
const position = ref(0)

function toggle() {
  if (!audio.value) return
  if (audio.value.paused) audio.value.play()
  else audio.value.pause()
}

function seek(event: Event) {
  if (!audio.value) return
  audio.value.currentTime = Number((event.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="player">
    <audio
      ref="audio"
      :src="src"
      preload="metadata"
      @loadedmetadata="duration = audio?.duration ?? 0"
      @timeupdate="position = audio?.currentTime ?? 0"
      @play="playing = true"
      @pause="playing = false"
      @ended="playing = false"
    ></audio>
    <button
      type="button"
      class="play"
      :aria-label="`${playing ? 'Pause' : 'Play'} ${title}`"
      @click="toggle"
    >
      <svg
        v-if="!playing"
        width="30"
        height="34"
        viewBox="0 0 30 34"
        aria-hidden="true"
      >
        <path
          d="M0 0 L30 17 L0 34 Z"
          fill="currentColor"
        />
      </svg>
      <svg
        v-else
        width="30"
        height="34"
        viewBox="0 0 30 34"
        aria-hidden="true"
      >
        <path
          d="M2 0 H11 V34 H2 Z M19 0 H28 V34 H19 Z"
          fill="currentColor"
        />
      </svg>
    </button>
    <input
      type="range"
      class="seek"
      :aria-label="`Seek ${title}`"
      min="0"
      :max="duration || 0"
      step="0.1"
      :value="position"
      @input="seek"
    />
  </div>
</template>

<style scoped>
.player {
  display: flex;
  align-items: center;
  gap: 24px;
  box-sizing: border-box;
  max-width: 578px;
  height: 104px;
  padding: 0 40px 0 24px;
  background: var(--sunlight);
  color: var(--black);
}

.play {
  flex: none;
  padding: 8px;
  border: 0;
  background: none;
  color: inherit;
  cursor: pointer;
}

.seek {
  flex: 1;
  min-width: 0;
  height: 40px;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

.seek::-webkit-slider-runnable-track {
  height: 5px;
  border-radius: 3px;
  background: var(--black);
}

.seek::-moz-range-track {
  height: 5px;
  border-radius: 3px;
  background: var(--black);
}

.seek::-webkit-slider-thumb {
  width: 16px;
  height: 36px;
  margin-top: -15px;
  appearance: none;
  border: 0;
  border-radius: 0;
  background: var(--brick);
}

.seek::-moz-range-thumb {
  width: 16px;
  height: 36px;
  border: 0;
  border-radius: 0;
  background: var(--brick);
}

.play:focus-visible,
.seek:focus-visible {
  outline: 3px solid var(--black);
  outline-offset: 2px;
}
</style>
