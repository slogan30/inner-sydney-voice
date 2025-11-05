<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core'
import { useProgramStore } from '@/stores/programStore'

const router = useRouter()
const programStore = useProgramStore()

// Load programs on mount
onMounted(async () => {
  await programStore.listPrograms()
})

// Helper function to add one interval unit to a date
const addInterval = (date: Date, intervalType: string): Date => {
  const newDate = new Date(date)

  switch (intervalType.toLowerCase()) {
    case 'daily':
      newDate.setDate(newDate.getDate() + 1)
      break
    case 'weekly':
      newDate.setDate(newDate.getDate() + 7)
      break
    case 'fortnightly':
      newDate.setDate(newDate.getDate() + 14)
      break
    case 'monthly':
      newDate.setMonth(newDate.getMonth() + 1)
      break
  }

  return newDate
}

// Transform programs into calendar events, with repeating occurrences
const calendarEvents = computed(() => {
  const events: EventInput[] = []
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

  programStore.programs
    .filter((program) => program.start_date)
    .forEach((program, index) => {
      const color = colors[index % colors.length]
      const startDate = new Date(program.start_date!)
      const endDate = program.end_date ? new Date(program.end_date) : null

      // If program has repeat interval and date interval, generate recurring events
      if (program.repeat_interval && program.date_interval) {
        console.log(`Generating recurring events for: ${program.name}`, {
          start: startDate,
          end: endDate,
          interval: program.date_interval,
          repeat: program.repeat_interval,
        })

        let currentStartDate = new Date(startDate)
        let currentEndDate = endDate ? new Date(endDate) : null
        const repeatCount = program.repeat_interval // How many times to repeat

        // Generate the specified number of occurrences
        for (let i = 0; i < repeatCount; i++) {
          // Add 1 day to end date to make it inclusive (FullCalendar treats end as exclusive)
          const displayEndDate = currentEndDate ? new Date(currentEndDate) : null
          if (displayEndDate) {
            displayEndDate.setDate(displayEndDate.getDate() + 1)
          }

          events.push({
            id: `${program.program_id}_${i}`,
            title: program.name,
            start: currentStartDate.toISOString().split('T')[0],
            end: displayEndDate ? displayEndDate.toISOString().split('T')[0] : undefined,
            backgroundColor: color,
            borderColor: color,
            extendedProps: {
              description: program.description,
              address: program.address,
              provider_name: program.provider_name,
              program_id: program.program_id,
            },
          })

          // Calculate next occurrence (add one interval unit to both start and end)
          currentStartDate = addInterval(currentStartDate, program.date_interval)
          if (currentEndDate) {
            currentEndDate = addInterval(currentEndDate, program.date_interval)
          }
        }

        console.log(`Created ${repeatCount} occurrences for ${program.name}`)
      } else {
        // Single event (no repeat interval)
        // Add 1 day to end date to make it inclusive (FullCalendar treats end as exclusive)
        const displayEndDate = endDate ? new Date(endDate) : null
        if (displayEndDate) {
          displayEndDate.setDate(displayEndDate.getDate() + 1)
        }

        events.push({
          id: program.program_id,
          title: program.name,
          start: program.start_date!,
          end: displayEndDate?.toISOString().split('T')[0] || undefined,
          backgroundColor: color,
          borderColor: color,
          extendedProps: {
            description: program.description,
            address: program.address,
            provider_name: program.provider_name,
            program_id: program.program_id,
          },
        })
      }
    })

  return events
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
    // Use the program_id from extendedProps if available (for recurring events)
    const programId = info.event.extendedProps.program_id || info.event.id
    router.push(`/programs/${programId}`)
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
