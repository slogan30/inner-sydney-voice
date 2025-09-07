import { defineStore } from 'pinia'
import { ref } from 'vue'
import { listProgramsAPI } from '@/apis/programAPI'

export interface Program {
  program_id: string
  name: string
  description?: string | null
  start_date?: string | null
  end_date?: string | null
  date_interval?: string | null
  location?: string | null
  phone?: string | null
  email?: string | null
  website_url?: string | null
  provider_id?: string | null
}

export const useProgramStore = defineStore('program', () => {
  const programs = ref<Program[]>([])

  async function listPrograms() {
    const response = await listProgramsAPI()
    programs.value = response
  }

  return {
    programs,
    listPrograms,
  }
})
