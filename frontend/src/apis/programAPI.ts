import apiClient from './apiClient'
import { type Program } from '../stores/programStore'

export const listProgramsAPI = async (): Promise<Program[]> => {
  const response = await apiClient.get('/api/programs')
  console.log(response.data)
  return response.data
}
