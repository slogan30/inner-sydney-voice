<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import ProviderCard from '@/components/ProviderCard.vue'
import { useProviderStore } from '@/stores/providerStore'

// Use the program store
const providerStore = useProviderStore()
const { providers } = storeToRefs(providerStore)

onMounted(async () => {
  await providerStore.listProviders()
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-2">Providers</h1>
      <p class="text-lg text-gray-600">
        Explore our comprehensive collection of development providers
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <ProviderCard
        v-for="provider in providers"
        :key="provider.provider_id"
        :provider_id="provider.provider_id ?? ''"
        :name="provider.name ?? ''"
        :description="provider.description ?? ''"
        :programs="provider.programs"
      />
    </div>
  </div>
</template>
