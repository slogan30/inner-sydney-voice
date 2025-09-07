<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import ProgramCard from '@/components/ProgramCard.vue'
import { useProgramStore } from '@/stores/programStore'

// Use the program store
const programStore = useProgramStore()
const { programs } = storeToRefs(programStore)

onMounted(async () => {
  await programStore.listPrograms()
})
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
        :key="program.program_id"
        :title="program.name ?? ''"
        :description="program.description || ''"
        :start-date="program.start_date ?? ''"
        :end-date="program.end_date ?? ''"
        :date-interval="program.date_interval ?? ''"
        :location="program.location ?? ''"
        :email="program.email"
        :phone="program.phone"
        :website-url="program.website_url"
      />
    </div>
  </div>
</template>
