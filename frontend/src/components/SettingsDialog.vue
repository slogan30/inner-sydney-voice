<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { User } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/authStore'

const isOpen = defineModel('open', { required: true, type: Boolean })

const activeTab = ref('account')

const authStore = useAuthStore()
const router = useRouter()

const handleSignOut = async () => {
  await authStore.signOut()
  isOpen.value = false
  router.push('/')
}
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-[680px] h-[500px] p-0 gap-0">
      <DialogTitle class="sr-only">Settings</DialogTitle>
      <DialogDescription class="sr-only"> Manage your account settings </DialogDescription>
      <div class="flex h-full">
        <div class="w-[220px] border-r flex flex-col p-3">
          <div class="flex h-10 items-center justify-start px-1 mb-2"></div>
          <nav class="space-y-1">
            <button
              @click="activeTab = 'account'"
              :class="[
                'w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-left transition-colors',
                activeTab === 'account'
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
              ]"
            >
              <User class="h-5 w-5" />
              Account
            </button>
          </nav>
        </div>

        <div class="flex-1 p-6">
          <div v-if="activeTab === 'account'">
            <div v-if="authStore.user" class="space-y-6">
              <div class="space-y-1">
                <h3 class="text-lg font-medium">Account</h3>
                <p class="text-sm text-muted-foreground">View your account information.</p>
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium">Email</label>
                <p class="text-sm text-foreground">{{ authStore.user.email }}</p>
              </div>

              <Button @click="handleSignOut"> Sign Out </Button>
            </div>
            <div v-else class="text-sm text-muted-foreground">Loading account details...</div>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
