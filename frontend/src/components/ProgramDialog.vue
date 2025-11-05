<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { Check, ChevronsUpDown } from 'lucide-vue-next'
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label/index'
import { Textarea } from '@/components/ui/textarea/index'
import { useProviderStore } from '@/stores/providerStore'
import { useProgramStore } from '@/stores/programStore'
import { type ProgramCreatePayload } from '@/apis/programAPI'
import GooglePlacesAutocomplete from '@/components/GooglePlacesAutocomplete.vue'
import { cn } from '@/lib/utils'

const categories = [
  { value: 'education', label: 'Education and Skills Training' },
  { value: 'parenting', label: 'Parenting Support Programs' },
  { value: 'playgroups', label: 'Playgroups' },
  { value: 'hubs', label: 'Hubs' },
  { value: 'consultations', label: 'Community Consultations' },
  { value: 'youth', label: 'Youth Programs' },
  { value: 'training', label: 'Staff Capacity Building and Training' },
]

const isDialogOpen = ref(false)
const isSubmitting = ref(false)
const categoryOpen = ref(false)
const selectedPlace = ref<{
  placeId: string
  address: string
} | null>(null)

// Minimal form state (no submit logic yet)
const formData = ref<{
  name: string
  category: string
  description: string
  start_date: string
  end_date: string
  date_interval: string
  repeat_interval: number | string
  place_id: string
  address: string
  phone: string
  email: string
  website_url: string
  provider_id: string
}>({
  name: '',
  category: '',
  description: '',
  start_date: '',
  end_date: '',
  date_interval: '',
  repeat_interval: '',
  place_id: '',
  address: '',
  phone: '',
  email: '',
  website_url: '',
  provider_id: '',
})

// Compute the selected category label for display
const selectedCategoryLabel = computed(() => {
  const category = categories.find((c) => c.value === formData.value.category)
  return category ? category.label : 'Select category...'
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
    const payload: Partial<ProgramCreatePayload> = {
      name: formData.value.name,
      category: formData.value.category,
      description: formData.value.description,
      start_date: formData.value.start_date,
      end_date: formData.value.end_date,
      date_interval: formData.value.date_interval,
      repeat_interval:
        typeof formData.value.repeat_interval === 'number'
          ? formData.value.repeat_interval
          : undefined,
      place_id: formData.value.place_id,
      address: formData.value.address,
      phone: formData.value.phone,
      email: formData.value.email,
      website_url: formData.value.website_url,
      provider_id: formData.value.provider_id,
    }

    // Add place data if a place was selected
    if (selectedPlace.value) {
      payload.place_id = selectedPlace.value.placeId
      payload.address = selectedPlace.value.address
    }

    // Convert empty strings to undefined to let backend exclude None
    Object.keys(payload).forEach((k) => {
      const key = k as keyof typeof payload
      if (payload[key] === '' || payload[key] === null) {
        delete payload[key]
      }
    })

    await programStore.createProgram(payload as ProgramCreatePayload)
    isDialogOpen.value = false

    // Reset form
    formData.value = {
      name: '',
      category: '',
      description: '',
      start_date: '',
      end_date: '',
      date_interval: '',
      repeat_interval: '',
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

        <div class="grid grid-cols-4 items-center gap-4">
          <Label class="text-right">Category</Label>
          <Popover v-model:open="categoryOpen">
            <PopoverTrigger as-child>
              <Button
                variant="outline"
                role="combobox"
                :aria-expanded="categoryOpen"
                class="col-span-3 justify-between"
              >
                {{ selectedCategoryLabel }}
                <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-[400px] p-0">
              <Command>
                <CommandInput placeholder="Search category..." />
                <CommandEmpty>No category found.</CommandEmpty>
                <CommandList>
                  <CommandGroup>
                    <CommandItem
                      v-for="category in categories"
                      :key="category.value"
                      :value="category.value"
                      @select="
                        () => {
                          formData.category = category.value
                          categoryOpen = false
                        }
                      "
                    >
                      <Check
                        :class="
                          cn(
                            'mr-2 h-4 w-4',
                            formData.category === category.value ? 'opacity-100' : 'opacity-0',
                          )
                        "
                      />
                      {{ category.label }}
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
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

        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <Label for="start_date">Start Date</Label>
            <Input id="start_date" v-model="formData.start_date" type="date" />
          </div>
          <div class="flex flex-col gap-2">
            <Label for="end_date">End Date</Label>
            <Input id="end_date" v-model="formData.end_date" type="date" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <Label for="date_interval">Date Interval</Label>
            <select
              id="date_interval"
              v-model="formData.date_interval"
              class="border border-input rounded-md bg-background px-3 py-2 text-sm"
            >
              <option value="">Select interval</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Fortnightly">Fortnightly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>
          <div class="flex flex-col gap-2">
            <Label for="repeat_interval">Number of Times</Label>
            <Input
              id="repeat_interval"
              v-model.number="formData.repeat_interval"
              type="number"
              min="1"
              :disabled="!formData.date_interval"
              :placeholder="
                formData.date_interval
                  ? `How many ${formData.date_interval.toLowerCase()} occurrences?`
                  : 'Select interval first'
              "
            />
          </div>
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

        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <Label for="phone">Phone</Label>
            <Input id="phone" v-model="formData.phone" placeholder="Contact phone number" />
          </div>
          <div class="flex flex-col gap-2">
            <Label for="email">Email</Label>
            <Input id="email" v-model="formData.email" type="email" placeholder="Contact email" />
          </div>
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
