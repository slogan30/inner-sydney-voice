<script setup lang="ts">
import { Card, CardHeader, CardTitle } from '@/components/ui/card'

interface ProgramCardProps {
  title: string
  description: string
  startDate: string
  location: string
}

defineProps<ProgramCardProps>()
</script>

<template>
  <Card class="w-full max-w-md h-38">
    <CardHeader class="flex flex-row items-start space-y-0 pb-4 pt-4 h-full">
      <!-- Avatar circle -->
      <div class="w-12 h-12 bg-black rounded-full mr-4 flex-shrink-0 mt-3"></div>

      <!-- Content -->
      <div class="flex-1 min-w-0 h-full flex flex-col justify-between">
        <div class="flex-1">
          <CardTitle class="text-lg font-semibold truncate">{{ title }}</CardTitle>
          <p class="text-sm text-muted-foreground mt-1 line-clamp-2">{{ description }}</p>
        </div>

        <!-- Calendar icon and date -->
        <div class="flex items-center mt-2">
          <svg
            class="w-4 h-4 text-muted-foreground mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span class="text-sm text-muted-foreground"> {{ startDate }}</span>
        </div>

        <!-- Location icon and location -->
        <div class="flex items-center mt-1">
          <svg
            class="w-4 h-4 text-muted-foreground mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span class="text-sm text-muted-foreground"> {{ location }}</span>
        </div>
      </div>
    </CardHeader>
  </Card>
</template>
