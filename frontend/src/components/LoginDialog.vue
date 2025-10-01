<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Mail, ArrowLeft, CheckCircle } from 'lucide-vue-next'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface Props {
  mode?: 'signin' | 'signup'
  triggerText?: string
  triggerVariant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'signin',
  triggerText: 'Login',
  triggerVariant: 'secondary',
})

const authStore = useAuthStore()
const router = useRouter()
const email = ref('')
const isOpen = ref(false)
const showMagicLinkSent = ref(false)

const handleMagicLinkLogin = async () => {
  const result = await authStore.signInWithMagicLink(email.value, true)

  if (result.error) {
    alert(result.error.message)
  } else {
    showMagicLinkSent.value = true
  }
}

watch(
  () => authStore.isAuthenticated,
  (isAuthenticated) => {
    if (isAuthenticated) {
      isOpen.value = false
      router.push('/')
    }
  },
  { immediate: true },
)

const handleGoogleLogin = async () => {
  const { error } = await authStore.signInWithGoogle()
  if (error) {
    alert(error.message)
  }
}

const handleResendMagicLink = async () => {
  const result = await authStore.signInWithMagicLink(email.value, true)

  if (result.error) {
    alert(result.error.message)
  }
}

const goBackToLogin = () => {
  showMagicLinkSent.value = false
}

const openDialog = () => {
  isOpen.value = true
  showMagicLinkSent.value = false
}
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button :variant="props.triggerVariant" @click="openDialog" class="font-medium">{{
        props.triggerText
      }}</Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-md p-0 overflow-hidden">
      <!-- Login Form View -->
      <div v-if="!showMagicLinkSent" class="p-6">
        <DialogHeader class="text-center space-y-2">
          <DialogTitle class="text-2xl font-semibold tracking-tight">
            {{ props.mode === 'signin' ? 'Welcome back' : 'Sign up' }}
          </DialogTitle>
          <DialogDescription class="text-muted-foreground">
            {{
              props.mode === 'signin'
                ? 'Sign in to your account to continue'
                : 'Enter your details to continue'
            }}
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-6 mt-6">
          <!-- Main Form -->
          <form @submit.prevent="handleMagicLinkLogin" class="space-y-4">
            <!-- Email Field -->
            <div class="space-y-2">
              <Label for="email" class="text-sm font-medium text-foreground">Email address</Label>
              <div class="relative">
                <Mail
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
                />
                <Input
                  id="email"
                  v-model="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  class="h-11 pl-10 pr-4 text-base border-border focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200"
                />
              </div>
            </div>

            <!-- Submit Button -->
            <Button
              type="submit"
              class="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-md transition-all duration-200 shadow-sm hover:shadow-md"
              :disabled="authStore.loading"
            >
              <Loader2 v-if="authStore.loading" class="mr-2 h-4 w-4 animate-spin" />
              <Mail v-else class="mr-2 h-4 w-4" />
              Continue with Email
            </Button>
          </form>

          <!-- Divider -->
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-border" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-background text-muted-foreground font-medium"
                >or continue with</span
              >
            </div>
          </div>

          <!-- Google Sign In -->
          <Button
            variant="outline"
            class="w-full h-11 border-border hover:bg-accent hover:text-accent-foreground text-foreground font-medium rounded-md transition-all duration-200 shadow-sm hover:shadow-md"
            @click="handleGoogleLogin"
            :disabled="authStore.loading"
          >
            <svg class="mr-3 h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <!-- Terms -->
          <div class="text-center text-xs text-muted-foreground space-x-4 pt-2">
            <a
              href="#"
              class="hover:text-foreground transition-colors duration-200 underline-offset-4 hover:underline"
              >Terms of Use</a
            >
            <span>•</span>
            <a
              href="#"
              class="hover:text-foreground transition-colors duration-200 underline-offset-4 hover:underline"
              >Privacy Policy</a
            >
          </div>
        </div>
      </div>

      <!-- Magic Link Sent View -->
      <div v-else class="p-6">
        <DialogHeader class="text-center space-y-2">
          <div
            class="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4"
          >
            <CheckCircle class="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle class="text-2xl font-semibold tracking-tight">Check your email</DialogTitle>
        </DialogHeader>

        <div class="space-y-6 mt-6">
          <!-- Success Message for Magic Link -->
          <Alert class="border-green-200 bg-green-50/50">
            <AlertDescription class="text-foreground text-sm leading-relaxed">
              We've sent you a magic link to:
              <span class="font-medium text-green-700">{{ email }}</span>
            </AlertDescription>
          </Alert>

          <div class="text-center space-y-4">
            <div class="text-sm text-muted-foreground">
              Didn't receive the email? Check your spam folder or
            </div>
            <div class="flex flex-col space-y-3">
              <Button
                variant="outline"
                size="sm"
                @click="handleResendMagicLink"
                :disabled="authStore.loading"
                class="text-foreground border-border hover:bg-accent hover:text-accent-foreground transition-all duration-200"
              >
                <Loader2 v-if="authStore.loading" class="mr-2 h-3 w-3 animate-spin" />
                <Mail v-else class="mr-2 h-3 w-3" />
                Resend magic link
              </Button>
              <Button
                variant="ghost"
                size="sm"
                @click="goBackToLogin"
                class="text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
              >
                <ArrowLeft class="mr-2 h-3 w-3" />
                Back to login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
