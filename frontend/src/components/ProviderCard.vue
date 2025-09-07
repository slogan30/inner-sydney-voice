<script setup lang="ts">
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'vue-router'

interface ProviderCardProps {
  provider_id: string
  name: string
  description: string
  programs?: Array<{ program_id: string; name: string }>
}

const props = defineProps<ProviderCardProps>()
const router = useRouter()

const handleClick = () => {
  router.push(`/providers/${props.provider_id}`)
}
</script>

<template>
  <Card
    class="w-full max-w-md h-32 cursor-pointer hover:shadow-lg transition-shadow"
    @click="handleClick"
  >
    <CardHeader class="flex flex-row items-start space-y-0 pb-4 pt-4 h-full">
      <!-- Avatar circle -->
      <div class="w-12 h-12 bg-black rounded-full mr-4 flex-shrink-0 mt-3"></div>

      <!-- Content -->
      <div class="flex-1 min-w-0 h-full flex flex-col justify-between">
        <div class="flex-1">
          <CardTitle class="text-lg font-semibold truncate">{{ name }}</CardTitle>
          <p class="text-sm text-muted-foreground mt-1 line-clamp-2">{{ description }}</p>
          <div v-if="programs && programs.length > 0" class="mt-2">
            <span
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {{ programs.length }} program{{ programs.length !== 1 ? 's' : '' }}
            </span>
          </div>
        </div>
      </div>
    </CardHeader>
  </Card>
</template>
