<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { CalendarOptions, EventClickArg } from '@fullcalendar/core'
import { useProgramStore } from '@/stores/programStore'

const router = useRouter()
const programStore = useProgramStore()

// Load programs on mount
onMounted(async () => {
  await programStore.listPrograms()
})

// Transform programs into calendar events
const calendarEvents = computed(() => {
  return programStore.programs
    .filter((program) => program.start_date) // Only include programs with a start date
    .map((program, index) => {
      // Use different colors for variety
      const colors = [
        '#3b82f6', // blue
        '#10b981', // green
        '#f59e0b', // amber
        '#8b5cf6', // purple
        '#ec4899', // pink
        '#06b6d4', // cyan
        '#84cc16', // lime
        '#ef4444', // red
      ]
      const color = colors[index % colors.length]

      return {
        id: program.program_id,
        title: program.name,
        start: program.start_date!,
        end: program.end_date || undefined,
        backgroundColor: color,
        borderColor: color,
        extendedProps: {
          description: program.description,
          address: program.address,
          provider_name: program.provider_name,
        },
      }
    })
})

// Calendar options
const calendarOptions = computed<CalendarOptions>(() => ({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,dayGridWeek',
  },
  height: 'auto',
  dayMaxEvents: 3, // This creates the "+more" link when there are more than 3 events
  events: calendarEvents.value,
  eventClick: (info: EventClickArg) => {
    // Navigate to program details page
    router.push(`/programs/${info.event.id}`)
  },
  dateClick: (info) => {
    console.log('Clicked on date:', info.dateStr)
  },
}))
</script>

<template>
  <div class="w-full h-full p-4 bg-white rounded-lg shadow-sm">
    <FullCalendar :options="calendarOptions" />
  </div>
</template>

<style>
/* Tailwind-friendly FullCalendar customization */
:root {
  --fc-border-color: #e5e7eb;
  --fc-button-bg-color: #3b82f6;
  --fc-button-border-color: #3b82f6;
  --fc-button-hover-bg-color: #2563eb;
  --fc-button-hover-border-color: #2563eb;
  --fc-button-active-bg-color: #1d4ed8;
  --fc-button-active-border-color: #1d4ed8;
  --fc-today-bg-color: #dbeafe;
}

.fc {
  font-family: inherit;
}

.fc .fc-button {
  @apply text-sm font-medium rounded-md px-4 py-2;
}

.fc .fc-toolbar-title {
  @apply text-2xl font-semibold text-gray-900;
}

.fc .fc-col-header-cell {
  @apply text-sm font-semibold text-gray-700 bg-gray-50;
}

.fc .fc-daygrid-day-number {
  @apply text-sm text-gray-900 font-medium;
}

.fc .fc-daygrid-event {
  @apply text-xs rounded px-1 cursor-pointer;
}

.fc .fc-daygrid-more-link {
  @apply text-xs text-blue-600 font-medium hover:text-blue-800;
}
</style>
