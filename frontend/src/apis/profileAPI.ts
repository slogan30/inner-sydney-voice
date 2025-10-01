import apiClient from './apiClient'
import type { Profile } from '@/stores/authStore'
import { supabase } from '@/utils/supabase'

export const fetchProfileAPI = async (): Promise<Profile> => {
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      throw sessionError
    }

    const accessToken = session?.access_token
    if (!accessToken) {
      throw new Error('Not authenticated: missing access token')
    }

    const response = await apiClient.get<Profile>('/profile', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching user profile:', error)
    throw error
  }
}
