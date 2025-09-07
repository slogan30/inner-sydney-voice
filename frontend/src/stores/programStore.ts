import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  listProgramsAPI,
  getProgramAPI,
  createProgramAPI,
  type ProgramCreatePayload,
} from '@/apis/programAPI'

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
  provider_name?: string | null
}

export const useProgramStore = defineStore('program', () => {
  const programs = ref<Program[]>([])
  const program = ref<Program>()

  async function listPrograms() {
    const response = await listProgramsAPI()
    programs.value = response
  }

  async function getProgram(program_id: string) {
    const response = await getProgramAPI(program_id)
    program.value = response
  }

  async function createProgram(payload: ProgramCreatePayload) {
    const created = await createProgramAPI(payload)
    // Prepend or append; for now, prepend to show newest first
    programs.value = [created, ...programs.value]
    return created
  }

  return {
    programs,
    program,
    listPrograms,
    getProgram,
    createProgram,
  }
})
