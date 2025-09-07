import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ProviderData {
  name: string
  description: string
}

export const useProviderStore = defineStore('provider', () => {
  // State
  const providers = ref<ProviderData[]>([
    {
      name: 'Mission Australia',
      description:
        'Supporting disadvantaged individuals and families through housing, employment, and community services across Sydney',
    },
    {
      name: 'Salvation Army',
      description:
        'Providing emergency relief, housing support, and community programs for vulnerable populations in Sydney',
    },
    {
      name: 'St Vincent de Paul Society',
      description:
        'Offering financial assistance, food support, and community services to those in need across Sydney',
    },
    {
      name: 'Anglicare Sydney',
      description:
        'Delivering aged care, disability services, and community support programs throughout Sydney',
    },
    {
      name: 'Uniting Care',
      description:
        'Supporting families, children, and individuals with mental health, housing, and community services',
    },
    {
      name: 'CatholicCare Sydney',
      description:
        'Providing counseling, family support, and community services to vulnerable individuals and families',
    },
    {
      name: 'Wesley Mission',
      description:
        'Offering homelessness services, mental health support, and community programs across Sydney',
    },
    {
      name: 'Red Cross Australia',
      description:
        'Emergency relief, disaster recovery, and community support services for disadvantaged populations',
    },
    {
      name: 'Foodbank NSW',
      description:
        'Fighting hunger by providing food relief to charities and community organizations across Sydney',
    },
    {
      name: 'Youth Off The Streets',
      description:
        'Supporting homeless and disadvantaged young people through education, housing, and life skills programs',
    },
    {
      name: 'Sydney Community Services',
      description:
        'Local community support including aged care, disability services, and family support programs',
    },
    {
      name: 'Inner West Community Services',
      description:
        "Providing community development, family support, and social inclusion programs in Sydney's Inner West",
    },
    {
      name: 'South West Sydney Community Services',
      description:
        'Supporting multicultural communities with settlement services, family support, and community programs',
    },
    {
      name: 'Northern Beaches Community Services',
      description:
        'Delivering aged care, disability support, and community programs across the Northern Beaches',
    },
    {
      name: 'Eastern Suburbs Community Services',
      description:
        'Supporting vulnerable families and individuals with counseling, housing, and community programs',
    },
    {
      name: 'Western Sydney Community Services',
      description:
        'Providing multicultural support, youth services, and community development programs in Western Sydney',
    },
    {
      name: 'Sydney Homeless Connect',
      description:
        'Connecting homeless individuals with essential services, housing support, and community resources',
    },
    {
      name: 'Community First Step',
      description:
        'Supporting families and individuals with mental health services, housing support, and community programs',
    },
    {
      name: 'Sydney Community Housing',
      description:
        'Providing affordable housing solutions and tenancy support for disadvantaged individuals and families',
    },
    {
      name: 'Multicultural Community Services',
      description:
        'Supporting culturally and linguistically diverse communities with settlement, family, and community services',
    },
  ])

  // Getters
  const getProviders = () => providers.value
  const getProviderByName = (name: string) =>
    providers.value.find((provider) => provider.name === name)

  // Actions
  const addProvider = (provider: ProviderData) => {
    providers.value.push(provider)
  }

  const removeProvider = (name: string) => {
    const index = providers.value.findIndex((provider) => provider.name === name)
    if (index > -1) {
      providers.value.splice(index, 1)
    }
  }

  const updateProvider = (name: string, updatedProvider: Partial<ProviderData>) => {
    const index = providers.value.findIndex((provider) => provider.name === name)
    if (index > -1) {
      providers.value[index] = { ...providers.value[index], ...updatedProvider }
    }
  }

  return {
    // State
    providers,
    // Getters
    getProviders,
    getProviderByName,
    // Actions
    addProvider,
    removeProvider,
    updateProvider,
  }
})
