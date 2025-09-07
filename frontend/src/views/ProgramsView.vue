<script setup lang="ts">
import ProgramCard from '@/components/ProgramCard.vue'
import { useProgramStore } from '@/stores/programStore'

// Use the program store
const programStore = useProgramStore()
const programs = programStore.getPrograms()
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-2">Programs</h1>
      <p class="text-lg text-gray-600">
        Explore our comprehensive collection of development programs
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <ProgramCard
        v-for="program in programs"
        :key="program.title"
        :title="program.title"
        :description="program.description"
        :start-date="program.startDate"
        :location="program.location"
      />
    </div>
  </div>
</template>
