<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useProviderStore } from '@/stores/providerStore'

const route = useRoute()
const router = useRouter()
const providerStore = useProviderStore()
const { provider } = storeToRefs(providerStore)

const providerId = computed(() => route.params.id as string)

onMounted(async () => {
  if (providerId.value) {
    await providerStore.getProvider(providerId.value)
  }
})

const goBack = () => {
  router.push('/providers')
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Back button -->
    <div class="mb-6">
      <Button @click="goBack" variant="outline" class="mb-4">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Providers
      </Button>
    </div>

    <!-- Provider Details -->
    <div v-if="provider" class="max-w-4xl mx-auto">
      <Card class="mb-6">
        <CardHeader>
          <div class="flex items-start space-x-4">
            <!-- Avatar circle -->
            <div class="w-16 h-16 bg-black rounded-full flex-shrink-0"></div>

            <div class="flex-1">
              <CardTitle class="text-3xl font-bold mb-2">{{ provider.name }}</CardTitle>
            </div>
          </div>
        </CardHeader>
      </Card>

      <!-- Description Box -->
      <Card v-if="provider.description" class="mb-6">
        <CardHeader>
          <CardTitle class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            About This Provider
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-lg leading-relaxed text-gray-700 whitespace-pre-line">
            {{ provider.description }}
          </p>
        </CardContent>
      </Card>

      <!-- Programs Section -->
      <Card v-if="provider.programs && provider.programs.length > 0" class="mb-6">
        <CardHeader>
          <CardTitle class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            Programs Offered ({{ provider.programs.length }})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="program in provider.programs"
              :key="program.program_id"
              class="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              @click="router.push(`/programs/${program.program_id}`)"
            >
              <h3 class="font-medium text-gray-900 mb-1">{{ program.name }}</h3>
              <p class="text-sm text-gray-500">Click to view details</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Loading state -->
    <div v-else class="flex justify-center items-center py-12">
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"
        ></div>
        <p class="text-muted-foreground">Loading provider details...</p>
      </div>
    </div>
  </div>
</template>
