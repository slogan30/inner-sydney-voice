import apiClient from './apiClient'
import { type Program } from '../stores/programStore'

export const listProgramsAPI = async (): Promise<Program[]> => {
  const response = await apiClient.get('/api/programs')
  console.log('listProgramsAPI', response.data)
  return response.data
}

export const getProgramAPI = async (id: string): Promise<Program> => {
  const response = await apiClient.get(`/api/programs/${id}`)
  console.log('getProgramAPI', response.data)
  return response.data
}
