import apiClient from './apiClient'
import { type Provider } from '../stores/providerStore'

export const listProvidersAPI = async (): Promise<Provider[]> => {
  console.log('listProvidersAPI')
  const response = await apiClient.get('/providers')
  console.log('listProvidersAPI', response)
  return response.data
}

export const getProviderAPI = async (id: string): Promise<Provider> => {
  const response = await apiClient.get(`/providers/${id}`)
  return response.data
}
