import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'
import type { User, Session } from '@supabase/supabase-js'
import { fetchProfileAPI } from '@/apis/profileAPI'

export interface Profile {
  user_id: string
  email: string | null
  created_at: string | null
  provider_id: string | null
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const profile = ref<Profile | null>(null)
  const loading = ref<boolean>(false)
  const isInitialized = ref<boolean>(false)
  const isAuthenticated = computed(() => !!user.value)
  const token = computed(() => session.value?.access_token || null)

  async function loadUserProfile() {
    if (!isAuthenticated.value || !token.value) {
      console.log('Not authenticated, clearing profile.')
      profile.value = null
      return
    }
    try {
      const userProfileData = await fetchProfileAPI()
      profile.value = userProfileData
    } catch (error) {
      console.error('Failed to load user profile in store:', error)
      profile.value = null
    }
  }

  async function signInWithMagicLink(email: string, shouldCreateUser: boolean = true) {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      return { data, error }
    } finally {
      loading.value = false
    }
  }

  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}`,
      },
    })
    return { data, error }
  }

  async function signOut() {
    await supabase.auth.signOut()
    user.value = null
    session.value = null
    profile.value = null
  }

  async function initializeAuth() {
    if (isInitialized.value) return

    isInitialized.value = true
    // Get initial session
    const {
      data: { session: initialSession },
    } = await supabase.auth.getSession()

    session.value = initialSession
    user.value = initialSession?.user ?? null

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (event, newSession) => {
      session.value = newSession
      user.value = newSession?.user ?? null

      if (newSession) {
        await loadUserProfile()
      } else {
        profile.value = null
      }
    })
  }

  return {
    user,
    session,
    profile,
    loading,
    isInitialized,
    isAuthenticated,
    loadUserProfile,
    signInWithMagicLink,
    signInWithGoogle,
    signOut,
    initializeAuth,
  }
})
