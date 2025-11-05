<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import ProgramCard from '@/components/ProgramCard.vue'
import { useProgramStore } from '@/stores/programStore'
import ProgramDialog from '@/components/ProgramDialog.vue'
import { Button } from '@/components/ui/button'
import { Calendar, Map } from 'lucide-vue-next'

// Use the store
const programStore = useProgramStore()
const { programs } = storeToRefs(programStore)

onMounted(async () => {
  await programStore.listPrograms()
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8 flex justify-between items-start">
      <div>
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Programs</h1>
        <p class="text-lg text-gray-600">
          Explore our comprehensive collection of development programs
        </p>
      </div>

      <div class="flex items-center gap-2">
        <RouterLink to="/calendar">
          <Button variant="outline">
            <Calendar :size="20" class="mr-2" />
            Calendar
          </Button>
        </RouterLink>
        <RouterLink to="/programs-map">
          <Button variant="outline">
            <Map :size="20" class="mr-2" />
            Map
          </Button>
        </RouterLink>
        <ProgramDialog />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <ProgramCard
        v-for="program in programs.filter((p) => p.program_id)"
        :key="program.program_id"
        :program-id="program.program_id"
        :title="program.name ?? ''"
        :description="program.description || ''"
        :start-date="program.start_date ?? ''"
        :end-date="program.end_date ?? ''"
        :date-interval="program.date_interval ?? ''"
        :repeat-interval="program.repeat_interval ?? null"
        :address="program.address ?? ''"
        :email="program.email"
        :phone="program.phone"
        :website-url="program.website_url"
      />
    </div>
  </div>
</template>
