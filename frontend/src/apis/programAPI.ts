import apiClient from './apiClient'
import { type Program } from '../stores/programStore'

export type ProgramCreatePayload = {
  name: string
  category?: string
  description?: string
  start_date?: string
  end_date?: string
  date_interval?: string
  repeat_interval?: number
  place_id?: string
  address?: string
  phone?: string
  email?: string
  website_url?: string
  provider_id?: string
}

export type ProgramUpdatePayload = {
  name?: string
  category?: string
  description?: string
  start_date?: string
  end_date?: string
  date_interval?: string
  repeat_interval?: number
  place_id?: string
  address?: string
  phone?: string
  email?: string
  website_url?: string
  provider_id?: string
}

export const createProgramAPI = async (payload: ProgramCreatePayload): Promise<Program> => {
  console.log('createProgramAPI payload', payload)
  const response = await apiClient.post('/programs', payload)
  console.log('createProgramAPI response', response)
  return response.data
}

export const updateProgramAPI = async (
  id: string,
  payload: ProgramUpdatePayload,
): Promise<Program> => {
  const response = await apiClient.put(`/programs/${id}`, payload)
  return response.data
}

export const listProgramsAPI = async (): Promise<Program[]> => {
  const response = await apiClient.get('/programs')
  return response.data
}

export const getProgramAPI = async (id: string): Promise<Program> => {
  const response = await apiClient.get(`/programs/${id}`)
  return response.data
}
