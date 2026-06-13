<template>
  <button @click="toggle">Toggle {{ className }}</button>
  <br />
  <br />
  <div class="grid" :class="className">
    <div class="grid__container" />
    <div class="grid__container" />
    <div class="grid__container" />
    <div class="grid__container" />
  </div>

  <br />
  <button @click="shuffle">Shuffle</button>
  <ul>
    <li v-for="vowel in vowels" :key="vowel">{{ vowel }}</li>
  </ul>
</template>

<script setup>
import { ref, nextTick } from 'vue'

import Flip from './lib/flip.js'

const vowels = ref(['A', 'E', 'I', 'O', 'U'])

const classNames = [
  'grid-template-areas-1',
  'grid-template-areas-2',
  'grid-template-areas-3',
  'grid-template-areas-4',
]
const className = ref(classNames[0])

const toggle = async () => {
  const flip = new Flip('.grid__container')

  const random = Math.floor(Math.random() * classNames.length)

  if (classNames[random] === className.value) {
    toggle()
  } else {
    className.value = classNames[random]

    await flip.flip()

    toggle()
  }
}

const shuffle = async () => {
  const flip = new Flip('li')

  const from = flip.measure()

  vowels.value.reverse()

  await nextTick()

  const to = flip.measure()

  from.forEach((f) => {
    const t = to.find((x) => x.el === f.el)

    flip.invert(f.el, f, t, { duration: 500 })
  })
}
</script>

<style scoped>
.grid {
  gap: 16px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
}

.grid__container {
  border-radius: 8px;
}

.grid__container:nth-child(1) {
  grid-area: A;
  background-color: #406093;
}

.grid__container:nth-child(2) {
  grid-area: B;
  background-color: #4c8ce4;
}

.grid__container:nth-child(3) {
  grid-area: C;
  background-color: #91d06c;
}

.grid__container:nth-child(4) {
  grid-area: D;
  background-color: #fff799;
}

.grid__container {
  min-height: 100px;
}

.grid-template-areas-1 {
  grid-template-areas:
    'A B C'
    'D D D';
}

.grid-template-areas-2 {
  grid-template-areas:
    'A B C'
    'A D D';
}

.grid-template-areas-3 {
  grid-template-areas:
    'A B D'
    'C B D';
}

.grid-template-areas-4 {
  grid-template-areas:
    'A B C'
    'A B D';
}
</style>
