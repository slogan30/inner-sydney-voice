import { defineStore } from 'pinia'
import { ref } from 'vue'
import { listProvidersAPI, getProviderAPI } from '@/apis/providerAPI'

export interface Program {
  program_id: string
  name: string
}

export interface Provider {
  provider_id: string
  name: string
  description?: string
  programs?: Program[]
}

export const useProviderStore = defineStore('provider', () => {
  const providers = ref<Provider[]>([])
  const provider = ref<Provider>()

  async function listProviders() {
    const response = await listProvidersAPI()
    providers.value = response
  }

  async function getProvider(provider_id: string) {
    const response = await getProviderAPI(provider_id)
    provider.value = response
  }

  return {
    providers,
    provider,
    listProviders,
    getProvider,
  }
})
