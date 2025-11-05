<template>
  <div class="relative">
    <label v-if="label" class="block text-sm font-medium mb-2">{{ label }}</label>
    <gmp-place-autocomplete
      v-if="isLoaded"
      ref="autocompleteElement"
      :placeholder="placeholder"
      class="w-full"
    />
    <div v-if="loading" class="absolute right-3 top-1/2 transform -translate-y-1/2">
      <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, type Ref } from 'vue'

// Declare google types
declare global {
  interface Window {
    google: any
  }
  const google: any
}

interface LocationData {
  placeId: string
  address: string
}

interface Props {
  modelValue?: LocationData | null
  placeholder?: string
  label?: string
}

interface Emits {
  (e: 'update:modelValue', value: LocationData | null): void
  (e: 'place-selected', value: LocationData): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  placeholder: 'Search for a location...',
  label: '',
})

const emit = defineEmits<Emits>()

// Template refs
const autocompleteElement: Ref<any> = ref(null)

// Component state
const loading = ref(false)
const isLoaded = ref(false)

// Load Google Maps Places API with async loading
const loadGooglePlacesScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps && window.google.maps.places) {
      resolve()
      return
    }

    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      const checkLoaded = (): void => {
        if (window.google && window.google.maps && window.google.maps.places) {
          resolve()
        } else {
          setTimeout(checkLoaded, 100)
        }
      }
      checkLoaded()
      return
    }

    const script: HTMLScriptElement = document.createElement('script')
    script.async = true
    script.defer = true
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}&libraries=places&loading=async`

    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Google Places API'))

    document.head.appendChild(script)
  })
}

// Configure autocomplete element
const configureAutocomplete = (): void => {
  if (!autocompleteElement.value) {
    console.error('GooglePlacesAutocomplete - autocompleteElement is null in configureAutocomplete')
    return
  }

  // Set country restriction to Australia
  autocompleteElement.value.setAttribute('country', 'au')

  // Set types for the autocomplete
  autocompleteElement.value.setAttribute('type', 'establishment')

  // Listen for place selection via gmp-select event
  autocompleteElement.value.addEventListener('gmp-select', async (event: any) => {
    const { placePrediction } = event
    if (!placePrediction) {
      console.warn('GooglePlacesAutocomplete - No placePrediction in event')
      return
    }

    // Convert prediction to Place and fetch details
    const place = placePrediction.toPlace()
    await place.fetchFields({
      fields: ['id', 'displayName', 'formattedAddress', 'location'],
    })

    console.log('GooglePlacesAutocomplete - place object:', place)
    console.log('GooglePlacesAutocomplete - place.id:', place.id)
    console.log('GooglePlacesAutocomplete - placePrediction:', placePrediction)
    console.log('GooglePlacesAutocomplete - placePrediction.placeId:', placePrediction.placeId)

    // Use placePrediction.placeId for the proper place ID (starts with ChIJ)
    // place.id returns an encoded ID that doesn't work with Places API (New)
    const locationData: LocationData = {
      placeId: placePrediction.placeId || place.id || '',
      address: place.formattedAddress || '',
    }

    // Emit to parent components
    emit('update:modelValue', locationData)
    emit('place-selected', locationData)
  })
}

// Watch for external value changes to set the input value
watch(
  () => props.modelValue,
  (newValue) => {
    if (autocompleteElement.value) {
      if (newValue && newValue.address) {
        autocompleteElement.value.value = newValue.address
      } else {
        autocompleteElement.value.value = ''
      }
    }
  },
)

// Component lifecycle
onMounted(async (): Promise<void> => {
  try {
    loading.value = true
    await loadGooglePlacesScript()
    isLoaded.value = true

    // Wait for next tick to ensure element is rendered
    await new Promise((resolve) => setTimeout(resolve, 100))

    configureAutocomplete()

    // Set initial value if provided
    if (props.modelValue && props.modelValue.address && autocompleteElement.value) {
      autocompleteElement.value.value = props.modelValue.address
    }
  } catch (error) {
    console.error('Failed to load Google Places API:', error)
  } finally {
    loading.value = false
  }
})

onUnmounted((): void => {
  // Event listeners are automatically cleaned up when element is removed
})
</script>

<style scoped>
/* Style the gmp-place-autocomplete web component */
:deep(gmp-place-autocomplete) {
  width: 100%;
  display: block;
}

:deep(gmp-place-autocomplete input) {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  background-color: white;
}

:deep(gmp-place-autocomplete input:focus) {
  outline: none;
  box-shadow: 0 0 0 2px #3b82f6;
  border-color: transparent;
}
</style>
