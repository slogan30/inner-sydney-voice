<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>

<template>
  <nav class="flex items-center justify-between px-6 py-4 border-b">
    <!-- Logo -->
    <div class="flex items-center h-12">
      <img src="/src/assets/logo.png" alt="Logo" class="h-full w-auto max-w-none" />
    </div>

    <!-- Navigation buttons -->
    <div class="flex items-center gap-4">
      <RouterLink to="/programs">
        <Button variant="ghost">Programs</Button>
      </RouterLink>
      <RouterLink to="/providers">
        <Button variant="ghost">Providers</Button>
      </RouterLink>
      <Button variant="ghost" size="icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </Button>
    </div>
  </nav>
</template>
