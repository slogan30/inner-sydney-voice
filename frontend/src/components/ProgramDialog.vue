<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label/index'
import { Textarea } from '@/components/ui/textarea/index'
import { useProviderStore } from '@/stores/providerStore'
import { useProgramStore } from '@/stores/programStore'
import GooglePlacesAutocomplete from '@/components/GooglePlacesAutocomplete.vue'

const isDialogOpen = ref(false)
const isSubmitting = ref(false)
const selectedPlace = ref<{
  placeId: string
  address: string
} | null>(null)

// Minimal form state (no submit logic yet)
const formData = ref({
  name: '',
  description: '',
  start_date: '',
  end_date: '',
  date_interval: '',
  place_id: '',
  address: '',
  phone: '',
  email: '',
  website_url: '',
  provider_id: '',
})

// Providers dropdown data
const providerStore = useProviderStore()
const { providers } = storeToRefs(providerStore)

onMounted(async () => {
  await providerStore.listProviders()
})

const programStore = useProgramStore()

async function onSubmit() {
  if (!formData.value.name?.trim()) return
  try {
    isSubmitting.value = true
    const payload = { ...formData.value }

    // Add place data if a place was selected
    if (selectedPlace.value) {
      payload.place_id = selectedPlace.value.placeId
      payload.address = selectedPlace.value.address
    }

    // Convert empty strings to undefined to let backend exclude None
    Object.keys(payload).forEach((k) => {
      const key = k as keyof typeof payload
      if (payload[key] === '') {
        // @ts-expect-error runtime cleanup
        payload[key] = undefined
      }
    })

    await programStore.createProgram(payload as any)
    isDialogOpen.value = false

    // Reset form
    formData.value = {
      name: '',
      description: '',
      start_date: '',
      end_date: '',
      date_interval: '',
      place_id: '',
      address: '',
      phone: '',
      email: '',
      website_url: '',
      provider_id: '',
    }
    selectedPlace.value = null
  } finally {
    isSubmitting.value = false
  }
}

function onPlaceSelected(place: { placeId: string; address: string }) {
  selectedPlace.value = place
}
</script>

<template>
  <Dialog v-model:open="isDialogOpen">
    <DialogTrigger as-child>
      <Button>Add New Program</Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[600px] max-h-[95vh]">
      <DialogHeader>
        <DialogTitle>Add New Program</DialogTitle>
        <DialogDescription>
          Fill in the details for the new program. All fields are optional except the program name.
        </DialogDescription>
      </DialogHeader>

      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right">Name *</Label>
          <Input id="name" v-model="formData.name" class="col-span-3" placeholder="Program name" />
        </div>

        <div class="grid grid-cols-4 items-start gap-4">
          <Label for="description" class="text-right pt-2">Description</Label>
          <Textarea
            id="description"
            v-model="formData.description"
            class="col-span-3"
            placeholder="Program description"
            rows="3"
          />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="start_date" class="text-right">Start Date</Label>
          <Input id="start_date" v-model="formData.start_date" type="date" class="col-span-3" />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="end_date" class="text-right">End Date</Label>
          <Input id="end_date" v-model="formData.end_date" type="date" class="col-span-3" />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="date_interval" class="text-right">Date Interval</Label>
          <Input
            id="date_interval"
            v-model="formData.date_interval"
            class="col-span-3"
            placeholder="e.g., Weekly, Monthly, Daily"
          />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="address" class="text-right">Address</Label>
          <div class="col-span-3">
            <GooglePlacesAutocomplete
              v-model="selectedPlace"
              label=""
              placeholder="Search for an address..."
              @place-selected="onPlaceSelected"
            />
            <div v-if="selectedPlace" class="mt-2 text-xs text-muted-foreground">
              {{ selectedPlace.address }}
            </div>
          </div>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="phone" class="text-right">Phone</Label>
          <Input
            id="phone"
            v-model="formData.phone"
            class="col-span-3"
            placeholder="Contact phone number"
          />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="email" class="text-right">Email</Label>
          <Input
            id="email"
            v-model="formData.email"
            type="email"
            class="col-span-3"
            placeholder="Contact email"
          />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="website_url" class="text-right">Website URL</Label>
          <Input
            id="website_url"
            v-model="formData.website_url"
            type="url"
            class="col-span-3"
            placeholder="https://example.com"
          />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="provider_id" class="text-right">Provider</Label>
          <select
            id="provider_id"
            v-model="formData.provider_id"
            class="col-span-3 border border-input rounded-md bg-background px-3 py-2 text-sm"
          >
            <option value="">Select a provider</option>
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

      <DialogFooter>
        <Button variant="outline" @click="isDialogOpen = false" :disabled="isSubmitting">
          Cancel
        </Button>
        <Button type="button" @click="onSubmit" :disabled="!formData.name || isSubmitting">
          {{ isSubmitting ? 'Adding…' : 'Add Program' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
