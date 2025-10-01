<script setup lang="ts">
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import GooglePlacesAutocomplete from '@/components/GooglePlacesAutocomplete.vue'
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'

interface LocationData {
  address: string
  placeId: string
}

interface ProgramCardProps {
  programId?: string | null
  title: string
  description: string
  startDate?: string | null
  endDate?: string | null
  dateInterval?: string | null
  address?: string | null
  email?: string | null
  phone?: string | null
  websiteUrl?: string | null
  isEditable?: boolean // New prop to enable editing
}

const props = withDefaults(defineProps<ProgramCardProps>(), {
  programId: '',
  title: '',
  description: '',
  startDate: null,
  endDate: null,
  dateInterval: null,
  address: null,
  email: null,
  phone: null,
  websiteUrl: null,
  isEditable: false,
})

const emit = defineEmits<{
  'update:address': [locationData: LocationData]
}>()

const router = useRouter()

// Edit state
const isEditDialogOpen = ref(false)
const editForm = ref({
  title: props.title,
  description: props.description,
  startDate: props.startDate || '',
  location: null as LocationData | null,
})

// Computed location data from props
const currentLocation = computed((): LocationData | null => {
  if (props.address) {
    return {
      address: props.address,
      placeId: '',
    }
  }
  return null
})

const handleClick = () => {
  if (props.programId && !props.isEditable) {
    router.push(`/programs/${props.programId}`)
  }
}

const handleEditClick = (event: Event) => {
  event.stopPropagation()
  editForm.value = {
    title: props.title,
    description: props.description,
    startDate: props.startDate || '',
    location: currentLocation.value,
  }
  isEditDialogOpen.value = true
}

const handleLocationSelect = (locationData: LocationData) => {
  // The v-model binding already handles this, but we can add additional logic here if needed
  console.log('Location selected:', locationData)
}

const handleSave = () => {
  // Emit location update if location has changed
  if (editForm.value.location) {
    emit('update:address', editForm.value.location)
  }

  // Close dialog
  isEditDialogOpen.value = false

  // Here you would typically also emit other form changes
  // emit('update:title', editForm.value.title)
  // emit('update:description', editForm.value.description)
  // etc.
}
</script>

<template>
  <Card
    class="w-full max-w-md h-38 cursor-pointer hover:shadow-lg transition-shadow relative"
    @click="handleClick"
  >
    <!-- Edit button for editable cards -->
    <Button
      v-if="isEditable"
      variant="ghost"
      size="sm"
      class="absolute top-2 right-2 z-10"
      @click="handleEditClick"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    </Button>

    <CardHeader class="flex flex-row items-start space-y-0 pb-4 pt-4 h-full">
      <!-- Avatar circle -->
      <div class="w-12 h-12 bg-black rounded-full mr-4 flex-shrink-0 mt-3"></div>

      <!-- Content -->
      <div class="flex-1 min-w-0 h-full flex flex-col justify-between">
        <div class="flex-1">
          <CardTitle class="text-lg font-semibold truncate">{{ title }}</CardTitle>
          <p class="text-sm text-muted-foreground mt-1 line-clamp-2">{{ description }}</p>
        </div>

        <!-- Dates and schedule -->
        <div class="flex items-center mt-2 space-x-2">
          <svg
            class="w-4 h-4 text-muted-foreground mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span class="text-sm text-muted-foreground">
            {{ startDate }}
            <template v-if="endDate"> - {{ endDate }}</template>
            <template v-if="dateInterval"> • {{ dateInterval }}</template>
          </span>
        </div>

        <!-- Location icon and location -->
        <div class="flex items-center mt-1">
          <svg
            class="w-4 h-4 text-muted-foreground mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
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
          <span class="text-sm text-muted-foreground">{{ address || 'No address set' }}</span>
        </div>
      </div>
    </CardHeader>

    <!-- Edit Dialog -->
    <Dialog v-model:open="isEditDialogOpen">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Program</DialogTitle>
        </DialogHeader>

        <div class="space-y-4">
          <div>
            <Label for="title">Program Title</Label>
            <Input id="title" v-model="editForm.title" placeholder="Enter program title" />
          </div>

          <div>
            <Label for="description">Description</Label>
            <Input
              id="description"
              v-model="editForm.description"
              placeholder="Enter description"
            />
          </div>

          <div>
            <Label for="start-date">Start Date</Label>
            <Input id="start-date" v-model="editForm.startDate" type="date" />
          </div>

          <div>
            <GooglePlacesAutocomplete
              v-model="editForm.location"
              label="Address"
              placeholder="Search for an address..."
              @place-selected="handleLocationSelect"
            />

            <!-- Display selected location details -->
            <div v-if="editForm.location" class="mt-2 text-xs text-muted-foreground space-y-1">
              <div class="font-medium">Selected Location:</div>
              <div>{{ editForm.location.address }}</div>
            </div>
          </div>

          <div class="flex justify-end space-x-2">
            <Button variant="outline" @click="isEditDialogOpen = false"> Cancel </Button>
            <Button @click="handleSave"> Save Changes </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </Card>
</template>
