<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navigation bar -->
    <UHeader :links="navigationLinks" :search="{ placeholder: 'Search...' }">
      <template #logo>
        <NuxtLink to="/" class="flex items-center gap-2">
          <UIcon name="i-lucide-layout-kanban" class="text-primary text-xl" />
          <span class="font-bold text-lg">Task Board</span>
        </NuxtLink>
      </template>

      <!-- User menu -->
      <template #right>
        <div v-if="auth.isAuthenticated">
          <UDropdown :items="userMenuItems">
            <UButton
              color="gray"
              variant="ghost"
              :icon="auth.user?.avatar ? false : 'i-lucide-user'"
              trailing-icon="i-lucide-chevron-down"
            >
              <div
                v-if="auth.user?.avatar"
                class="w-6 h-6 rounded-full overflow-hidden mr-2"
              >
                <img
                  :src="auth.user.avatar"
                  alt="User avatar"
                  class="w-full h-full object-cover"
                />
              </div>
              <span>{{ auth.user?.username || auth.user?.email }}</span>
            </UButton>
          </UDropdown>
        </div>
        <div v-else class="flex items-center gap-2">
          <UButton to="/auth/login" variant="link">Log in</UButton>
          <UButton to="/auth/register" color="primary">Sign up</UButton>
        </div>
      </template>
    </UHeader>

    <!-- Page content -->
    <div class="container mx-auto px-4 py-6">
      <slot />
    </div>

    <!-- Footer -->
    <footer
      class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6"
    >
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-4 md:mb-0">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              © 2025 Task Board. All rights reserved.
            </p>
          </div>
          <div class="flex gap-4">
            <a href="#" class="text-gray-500 hover:text-primary">
              <UIcon name="i-lucide-github" class="text-xl" />
            </a>
            <a href="#" class="text-gray-500 hover:text-primary">
              <UIcon name="i-lucide-twitter" class="text-xl" />
            </a>
            <a href="#" class="text-gray-500 hover:text-primary">
              <UIcon name="i-lucide-linkedin" class="text-xl" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useAuth } from "~/composables/useAuth";

const auth = useAuth();

// Initialize authentication state
onMounted(() => {
  auth.init();
});

// Navigation links
const navigationLinks = computed(() => {
  // Base navigation items for all users
  const links = [
    {
      label: "Dashboard",
      to: "/",
      icon: "i-lucide-layout-dashboard",
    },
  ];

  // Add links based on authentication status
  if (auth.isAuthenticated) {
    links.push(
      {
        label: "Projects",
        to: "/projects",
        icon: "i-lucide-briefcase",
      },
      {
        label: "Tasks",
        to: "/tasks",
        icon: "i-lucide-check-square",
      }
    );

    // Add admin links if user is an admin
    if (auth.isAdmin) {
      links.push({
        label: "Admin",
        to: "/admin",
        icon: "i-lucide-shield",
      });
    }
  }

  return links;
});

// User dropdown menu
const userMenuItems = computed(() => [
  [
    {
      label: "Profile",
      icon: "i-lucide-user",
      to: "/profile",
    },
    {
      label: "Settings",
      icon: "i-lucide-settings",
      to: "/settings",
    },
  ],
  [
    {
      label: "Logout",
      icon: "i-lucide-log-out",
      click: () => handleLogout(),
    },
  ],
]);

// Handle user logout
const handleLogout = async () => {
  await auth.logout();
  navigateTo("/auth/login");
};
</script>
