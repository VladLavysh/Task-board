<template>
  <div
    class="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-4"
  >
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold">Welcome Back</h1>
        <p class="text-gray-500 mt-2">Sign in to your Task Board account</p>
      </div>

      <UCard class="mb-4">
        <UForm :state="formState" class="space-y-4" @submit="handleLogin">
          <UFormGroup label="Email" name="email">
            <UInput
              v-model="formState.email"
              type="email"
              autocomplete="email"
            />
          </UFormGroup>

          <UFormGroup label="Password" name="password">
            <UInput
              v-model="formState.password"
              type="password"
              autocomplete="current-password"
            />
          </UFormGroup>

          <div class="flex justify-between items-center">
            <UCheckbox v-model="rememberMe" label="Remember me" />
            <NuxtLink
              to="/auth/forgot-password"
              class="text-sm text-primary hover:underline"
            >
              Forgot password?
            </NuxtLink>
          </div>

          <UButton
            type="submit"
            color="primary"
            block
            :loading="auth.loading"
            :disabled="auth.loading"
          >
            Sign In
          </UButton>

          <UAlert
            v-if="auth.error"
            color="red"
            variant="soft"
            icon="i-lucide-alert-circle"
            title="Login Error"
            :description="auth.error"
            class="mt-4"
          />
        </UForm>

        <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div class="text-center mb-4">
            <span class="text-sm text-gray-500">Or sign in with</span>
          </div>

          <div class="flex gap-2">
            <UButton
              color="white"
              variant="outline"
              block
              class="justify-center"
              @click="loginWithGoogle"
            >
              <UIcon name="i-lucide-google" class="mr-2" />
              Google
            </UButton>

            <UButton
              color="white"
              variant="outline"
              block
              class="justify-center"
              @click="loginWithGitHub"
            >
              <UIcon name="i-lucide-github" class="mr-2" />
              GitHub
            </UButton>
          </div>
        </div>
      </UCard>

      <div class="text-center">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?
          <NuxtLink to="/auth/register" class="text-primary hover:underline">
            Sign up
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from "~/composables/useAuth";

// Define page metadata
definePageMeta({
  layout: "default",
  middleware: ["guest"],
});

const auth = useAuth();
const router = useRouter();

// Form state
const formState = ref({
  email: "",
  password: "",
});

const rememberMe = ref(false);

// Handle login form submission
const handleLogin = async () => {
  const success = await auth.login(
    formState.value.email,
    formState.value.password
  );

  if (success) {
    // Redirect to dashboard after successful login
    router.push("/");
  }
};

// Handle OAuth login methods
const loginWithGoogle = () => {
  window.location.href = "/api/auth/google";
};

const loginWithGitHub = () => {
  window.location.href = "/api/auth/github";
};
</script>
