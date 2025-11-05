import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  listProgramsAPI,
  getProgramAPI,
  createProgramAPI,
  updateProgramAPI,
  type ProgramCreatePayload,
  type ProgramUpdatePayload,
} from '@/apis/programAPI'

export interface Program {
  program_id: string
  name: string
  category?: string | null
  description?: string | null
  start_date?: string | null
  end_date?: string | null
  date_interval?: string | null
  repeat_interval?: number | null
  place_id?: string | null
  address?: string | null
  phone?: string | null
  email?: string | null
  website_url?: string | null
  provider_id?: string | null
  provider_name?: string | null
  is_approved?: boolean | null
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

  async function updateProgram(program_id: string, payload: ProgramUpdatePayload) {
    const updated = await updateProgramAPI(program_id, payload)
    // Update the program in the programs list
    const index = programs.value.findIndex((p) => p.program_id === program_id)
    if (index !== -1) {
      programs.value[index] = updated
    }
    // Also update the single program if it's the one being viewed
    if (program.value?.program_id === program_id) {
      program.value = updated
    }
    return updated
  }

  return {
    programs,
    program,
    listPrograms,
    getProgram,
    createProgram,
    updateProgram,
  }
})
