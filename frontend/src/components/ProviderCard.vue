<script setup lang="ts">
import { Card, CardHeader, CardTitle } from '@/components/ui/card'

interface ProviderCardProps {
  name: string
  description: string
}

defineProps<ProviderCardProps>()
</script>

<template>
  <Card class="w-full max-w-md h-32">
    <CardHeader class="flex flex-row items-start space-y-0 pb-4 pt-4 h-full">
      <!-- Avatar circle -->
      <div class="w-12 h-12 bg-black rounded-full mr-4 flex-shrink-0 mt-3"></div>

      <!-- Content -->
      <div class="flex-1 min-w-0 h-full flex flex-col justify-between">
        <div class="flex-1">
          <CardTitle class="text-lg font-semibold truncate">{{ name }}</CardTitle>
          <p class="text-sm text-muted-foreground mt-1 line-clamp-2">{{ description }}</p>
        </div>
      </div>
    </CardHeader>
  </Card>
</template>
