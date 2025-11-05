<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useProgramStore } from '@/stores/programStore'
import { useProviderStore } from '@/stores/providerStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-vue-next'

const programStore = useProgramStore()
const providerStore = useProviderStore()
const { programs } = storeToRefs(programStore)
const { providers } = storeToRefs(providerStore)

// Track edited program data
const editedPrograms = ref<{ [key: string]: any }>({})

// Computed property for unapproved programs
const unapprovedPrograms = computed(() => {
  return programs.value.filter((p) => p.is_approved === false)
})

onMounted(async () => {
  await programStore.listPrograms()
  await providerStore.listProviders()
})

// Initialize edited data for a program
const initProgramData = (program: any) => {
  if (!editedPrograms.value[program.program_id]) {
    editedPrograms.value[program.program_id] = {
      name: program.name || '',
      category: program.category || '',
      description: program.description || '',
      start_date: program.start_date || '',
      end_date: program.end_date || '',
      date_interval: program.date_interval || '',
      repeat_interval: program.repeat_interval || null,
      place_id: program.place_id || '',
      address: program.address || '',
      phone: program.phone || '',
      email: program.email || '',
      website_url: program.website_url || '',
      provider_id: program.provider_id || '',
    }
  }
  return editedPrograms.value[program.program_id]
}

// Handle program approval
const approveProgram = async (programId: string) => {
  try {
    const programData = editedPrograms.value[programId]

    // Prepare update payload with all edited fields plus is_approved
    const updatePayload = {
      ...programData,
      is_approved: true,
    }

    await programStore.updateProgram(programId, updatePayload)

    // Remove from edited programs
    delete editedPrograms.value[programId]

    // Refresh the list
    await programStore.listPrograms()
  } catch (error) {
    console.error('Error approving program:', error)
    alert('Failed to approve program. Please try again.')
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-2">Program Approval Dashboard</h1>
      <p class="text-lg text-gray-600">
        Review and approve pending programs ({{ unapprovedPrograms.length }} pending)
      </p>
    </div>

    <div v-if="unapprovedPrograms.length === 0" class="text-center py-12">
      <p class="text-xl text-gray-600">No programs pending approval</p>
    </div>

    <div class="space-y-6">
      <Card v-for="program in unapprovedPrograms" :key="program.program_id" class="relative">
        <CardHeader>
          <div class="flex justify-between items-start">
            <CardTitle class="text-2xl">Edit Program Details</CardTitle>
            <Button
              @click="approveProgram(program.program_id)"
              class="bg-green-600 hover:bg-green-700 text-white"
            >
              <Check :size="20" class="mr-2" />
              Approve
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Name -->
            <div class="space-y-2">
              <Label for="name">Program Name *</Label>
              <Input
                :id="`name-${program.program_id}`"
                v-model="initProgramData(program).name"
                placeholder="Enter program name"
              />
            </div>

            <!-- Category -->
            <div class="space-y-2">
              <Label for="category">Category</Label>
              <Input
                :id="`category-${program.program_id}`"
                v-model="initProgramData(program).category"
                placeholder="Enter category"
              />
            </div>

            <!-- Description (full width) -->
            <div class="space-y-2 md:col-span-2">
              <Label for="description">Description</Label>
              <Textarea
                :id="`description-${program.program_id}`"
                v-model="initProgramData(program).description"
                placeholder="Enter program description"
                class="min-h-[100px]"
              />
            </div>

            <!-- Start Date -->
            <div class="space-y-2">
              <Label for="start_date">Start Date</Label>
              <Input
                :id="`start_date-${program.program_id}`"
                v-model="initProgramData(program).start_date"
                type="date"
              />
            </div>

            <!-- End Date -->
            <div class="space-y-2">
              <Label for="end_date">End Date</Label>
              <Input
                :id="`end_date-${program.program_id}`"
                v-model="initProgramData(program).end_date"
                type="date"
              />
            </div>

            <!-- Date Interval -->
            <div class="space-y-2">
              <Label for="date_interval">Date Interval</Label>
              <Input
                :id="`date_interval-${program.program_id}`"
                v-model="initProgramData(program).date_interval"
                placeholder="e.g., weekly, monthly"
              />
            </div>

            <!-- Repeat Interval -->
            <div class="space-y-2">
              <Label for="repeat_interval">Repeat Interval</Label>
              <Input
                :id="`repeat_interval-${program.program_id}`"
                v-model.number="initProgramData(program).repeat_interval"
                type="number"
                placeholder="Number of repeats"
              />
            </div>

            <!-- Address (full width) -->
            <div class="space-y-2 md:col-span-2">
              <Label for="address">Address</Label>
              <Input
                :id="`address-${program.program_id}`"
                v-model="initProgramData(program).address"
                placeholder="Enter address"
              />
            </div>

            <!-- Place ID -->
            <div class="space-y-2">
              <Label for="place_id">Place ID</Label>
              <Input
                :id="`place_id-${program.program_id}`"
                v-model="initProgramData(program).place_id"
                placeholder="Google Place ID"
              />
            </div>

            <!-- Phone -->
            <div class="space-y-2">
              <Label for="phone">Phone</Label>
              <Input
                :id="`phone-${program.program_id}`"
                v-model="initProgramData(program).phone"
                type="tel"
                placeholder="Phone number"
              />
            </div>

            <!-- Email -->
            <div class="space-y-2">
              <Label for="email">Email</Label>
              <Input
                :id="`email-${program.program_id}`"
                v-model="initProgramData(program).email"
                type="email"
                placeholder="Email address"
              />
            </div>

            <!-- Website URL -->
            <div class="space-y-2">
              <Label for="website_url">Website URL</Label>
              <Input
                :id="`website_url-${program.program_id}`"
                v-model="initProgramData(program).website_url"
                type="url"
                placeholder="Website URL"
              />
            </div>

            <!-- Provider -->
            <div class="space-y-2 md:col-span-2">
              <Label for="provider">Provider</Label>
              <select
                :id="`provider-${program.program_id}`"
                v-model="initProgramData(program).provider_id"
                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">No Provider</option>
                <option
                  v-for="provider in providers"
                  :key="provider.provider_id"
                  :value="provider.provider_id"
                >
                  {{ provider.name }}
                </option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
