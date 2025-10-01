<template>
  <div>
    <div ref="mapContainer" class="map-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, type Ref, computed } from 'vue'
import { Loader } from '@googlemaps/js-api-loader'

// Define types for location with place ID
interface Location {
  placeId: string
}

// Template ref for the map container
const mapContainer: Ref<HTMLDivElement | null> = ref(null)

// Store map and markers instances
let map: unknown = null
type MinimalMarker = { map: unknown }
let markers: MinimalMarker[] = []

// Load programs from store and derive place IDs
import { storeToRefs } from 'pinia'
import { useProgramStore } from '@/stores/programStore'

// Declare google for TypeScript linting
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const google: any

const programStore = useProgramStore()
const { programs } = storeToRefs(programStore)

// Extract locations with place IDs from programs
const locations = computed<Location[]>(() => {
  const locs = programs.value
    .filter((p) => p.place_id != null && p.place_id !== '')
    .map((p) => ({
      placeId: p.place_id!,
    }))

  console.log('ProgramsMapView - programs:', programs.value)
  console.log('ProgramsMapView - filtered locations:', locs)
  return locs
})

// Sydney center coordinates
const sydneyCenter = { lat: -33.8688, lng: 151.2093 }

// Initialize map with place-based markers
const initMap = async (): Promise<void> => {
  console.log('ProgramsMapView - initMap called')
  if (!mapContainer.value) {
    console.error('ProgramsMapView - mapContainer.value is null')
    return
  }

  console.log('ProgramsMapView - locations to render:', locations.value)

  // Dynamically import required libraries
  const { AdvancedMarkerElement } = (await google.maps.importLibrary('marker')) as unknown as {
    AdvancedMarkerElement: new (opts: {
      position: { lat: number; lng: number } | null
      map: unknown
      title?: string
    }) => MinimalMarker
  }

  const { Place } = (await google.maps.importLibrary('places')) as unknown as {
    Place: new (opts: { id: string }) => {
      fetchFields: (opts: { fields: string[] }) => Promise<void>
      location: { lat: () => number; lng: () => number } | null
      displayName: string | null
      formattedAddress: string | null
    }
  }

  // Create map instance
  map = new google.maps.Map(mapContainer.value, {
    zoom: 12,
    center: sydneyCenter,
    mapId: 'YOUR_MAP_ID_HERE',
  })

  console.log('ProgramsMapView - map created')

  // Add markers for each location using Place ID
  const bounds = new google.maps.LatLngBounds()
  let hasValidLocation = false

  for (const [index, location] of locations.value.entries()) {
    console.log(`ProgramsMapView - processing location ${index}:`, location)
    try {
      // Create a Place instance with the Place ID
      const place = new Place({ id: location.placeId })

      // Fetch the required fields
      await place.fetchFields({
        fields: ['location', 'displayName', 'formattedAddress'],
      })

      console.log(`ProgramsMapView - place ${index} fetched:`, place)

      // Check if location is available
      if (place.location) {
        const position = {
          lat: place.location.lat(),
          lng: place.location.lng(),
        }

        console.log(`ProgramsMapView - creating marker at position:`, position)

        // Create marker at the place location
        const marker = new AdvancedMarkerElement({
          position: position,
          map: map,
          title: place.displayName || `Location ${index + 1}`,
        })
        markers.push(marker)

        // Extend bounds to include this location
        bounds.extend(position)
        hasValidLocation = true

        console.log(`ProgramsMapView - marker created successfully`)
      } else {
        console.warn(`No location data for place ${location.placeId}`)
      }
    } catch (error) {
      console.error(`Error processing place ${location.placeId}:`, error)
      // Continue with next location
    }
  }

  // Fit map to show all markers
  if (hasValidLocation && map instanceof google.maps.Map) {
    console.log('ProgramsMapView - fitting bounds to markers')
    map.fitBounds(bounds)
  } else {
    console.log('ProgramsMapView - no valid locations found, showing default center')
  }

  console.log(`ProgramsMapView - initMap complete, ${markers.length} markers created`)
}

const clearMarkers = (): void => {
  markers.forEach((marker) => {
    marker.map = null
  })
  markers = []
}

// Component lifecycle hooks
onMounted(async () => {
  const loader = new Loader({
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY as string,
    version: 'weekly',
    libraries: ['marker', 'places'],
  })

  try {
    await loader.load()
    await programStore.listPrograms()
    await initMap()
  } catch (error) {
    console.error('Failed to load Google Maps', error)
  }
})

onUnmounted(() => {
  clearMarkers()
  map = null
})
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 500px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
