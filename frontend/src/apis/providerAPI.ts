import apiClient from './apiClient'
import { type Provider } from '../stores/providerStore'

export const listProvidersAPI = async (): Promise<Provider[]> => {
  console.log('listProvidersAPI')
  const response = await apiClient.get('/api/providers')
  console.log('listProvidersAPI', response.data)
  return response.data
}

export const getProviderAPI = async (id: string): Promise<Provider> => {
  const response = await apiClient.get(`/api/providers/${id}`)
  console.log('getProviderAPI', response.data)
  return response.data
}
