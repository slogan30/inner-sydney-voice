<script setup lang="ts">
import ProviderCard from '@/components/ProviderCard.vue'
import { useProviderStore } from '@/stores/providerStore'

// Use the provider store
const providerStore = useProviderStore()
const providers = providerStore.getProviders()
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
        :key="provider.name"
        :name="provider.name"
        :description="provider.description"
      />
    </div>
  </div>
</template>
