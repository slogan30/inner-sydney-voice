<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useProgramStore } from '@/stores/programStore'

const route = useRoute()
const router = useRouter()
const programStore = useProgramStore()
const { program } = storeToRefs(programStore)

const programId = computed(() => route.params.id as string)

onMounted(async () => {
  if (programId.value) {
    await programStore.getProgram(programId.value)
  }
})

const goBack = () => {
  router.push('/programs')
}

const goToProvider = (providerId: string) => {
  router.push(`/providers/${providerId}`)
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
        Programs
      </Button>
    </div>

    <!-- Program Details -->
    <div v-if="program" class="max-w-4xl mx-auto">
      <Card class="mb-6">
        <CardHeader>
          <div class="flex items-start space-x-4">
            <!-- Avatar circle -->
            <div class="w-16 h-16 bg-black rounded-full flex-shrink-0"></div>

            <div class="flex-1">
              <CardTitle class="text-3xl font-bold mb-2">{{ program.name }}</CardTitle>
              <div v-if="program.provider_name" class="mt-2">
                <span class="text-sm text-muted-foreground">Provider: </span>
                <button
                  v-if="program.provider_id"
                  @click="goToProvider(program.provider_id)"
                  class="text-lg text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  {{ program.provider_name }}
                </button>
                <span v-else class="text-lg">{{ program.provider_name }}</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <!-- Description Box -->
      <Card v-if="program.description" class="mb-6">
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
            About This Program
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-lg leading-relaxed text-gray-700 whitespace-pre-line">
            {{ program.description }}
          </p>
        </CardContent>
      </Card>

      <!-- Program Information Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Dates -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Program Dates
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <div v-if="program.start_date">
              <p class="text-sm font-medium text-muted-foreground">Start Date</p>
              <p class="text-lg">{{ program.start_date }}</p>
            </div>
            <div v-if="program.end_date">
              <p class="text-sm font-medium text-muted-foreground">End Date</p>
              <p class="text-lg">{{ program.end_date }}</p>
            </div>
            <div v-if="program.date_interval">
              <p class="text-sm font-medium text-muted-foreground">Schedule</p>
              <p class="text-lg">{{ program.date_interval }}</p>
            </div>
          </CardContent>
        </Card>

        <!-- Location -->
        <Card v-if="program.location">
          <CardHeader>
            <CardTitle class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-lg">{{ program.location }}</p>
          </CardContent>
        </Card>

        <!-- Contact Information -->
        <Card v-if="program.email || program.phone">
          <CardHeader>
            <CardTitle class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <div v-if="program.email">
              <p class="text-sm font-medium text-muted-foreground">Email</p>
              <a
                :href="`mailto:${program.email}`"
                class="text-lg text-blue-600 hover:text-blue-800"
              >
                {{ program.email }}
              </a>
            </div>
            <div v-if="program.phone">
              <p class="text-sm font-medium text-muted-foreground">Phone</p>
              <a :href="`tel:${program.phone}`" class="text-lg text-blue-600 hover:text-blue-800">
                {{ program.phone }}
              </a>
            </div>
          </CardContent>
        </Card>

        <!-- Website -->
        <Card v-if="program.website_url">
          <CardHeader>
            <CardTitle class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              Website
            </CardTitle>
          </CardHeader>
          <CardContent>
            <a
              :href="program.website_url"
              target="_blank"
              rel="noopener noreferrer"
              class="text-lg text-blue-600 hover:text-blue-800 break-all"
            >
              {{ program.website_url }}
            </a>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Loading state -->
    <div v-else class="flex justify-center items-center py-12">
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"
        ></div>
        <p class="text-muted-foreground">Loading program details...</p>
      </div>
    </div>
  </div>
</template>
