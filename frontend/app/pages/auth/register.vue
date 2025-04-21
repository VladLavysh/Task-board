<template>
  <div
    class="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-4"
  >
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold">Create an Account</h1>
        <p class="text-gray-500 mt-2">
          Join Task Board to manage your projects
        </p>
      </div>

      <UCard class="mb-4">
        <UForm :state="formState" class="space-y-4" @submit="handleRegister">
          <UFormGroup label="Username" name="username">
            <UInput v-model="formState.username" autocomplete="username" />
          </UFormGroup>

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
              autocomplete="new-password"
            />
            <template #hint>
              <p class="text-xs text-gray-500">
                Password must be at least 8 characters long and contain a mix of
                letters, numbers, and symbols.
              </p>
            </template>
          </UFormGroup>

          <UFormGroup label="Confirm Password" name="confirmPassword">
            <UInput
              v-model="formState.confirmPassword"
              type="password"
              autocomplete="new-password"
            />
          </UFormGroup>

          <div class="flex items-center">
            <UCheckbox
              v-model="formState.termsAccepted"
              name="termsAccepted"
              label="I agree to the"
              required
            />
            <NuxtLink
              to="/terms"
              class="ml-1 text-primary text-sm hover:underline"
            >
              Terms of Service
            </NuxtLink>
            <span class="mx-1 text-sm">and</span>
            <NuxtLink
              to="/privacy"
              class="text-primary text-sm hover:underline"
            >
              Privacy Policy
            </NuxtLink>
          </div>

          <UButton
            type="submit"
            color="primary"
            block
            :loading="auth.loading"
            :disabled="auth.loading"
          >
            Create Account
          </UButton>

          <UAlert
            v-if="auth.error"
            color="red"
            variant="soft"
            icon="i-lucide-alert-circle"
            title="Registration Error"
            :description="auth.error"
            class="mt-4"
          />
        </UForm>

        <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div class="text-center mb-4">
            <span class="text-sm text-gray-500">Or sign up with</span>
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
          Already have an account?
          <NuxtLink to="/auth/login" class="text-primary hover:underline">
            Sign in
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
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  termsAccepted: false,
});

// Validate form before submission
const validateForm = () => {
  // Validate password length
  if (formState.value.password.length < 8) {
    auth.error = "Password must be at least 8 characters long";
    return false;
  }

  // Validate password match
  if (formState.value.password !== formState.value.confirmPassword) {
    auth.error = "Passwords do not match";
    return false;
  }

  // Validate terms acceptance
  if (!formState.value.termsAccepted) {
    auth.error = "You must accept the Terms of Service and Privacy Policy";
    return false;
  }

  return true;
};

// Handle registration form submission
const handleRegister = async () => {
  // Clear previous error
  auth.error = "";

  // Validate form
  if (!validateForm()) {
    return;
  }

  // Prepare registration data
  const userData = {
    username: formState.value.username,
    email: formState.value.email,
    password: formState.value.password,
  };

  // Register user
  const success = await auth.register(userData);

  if (success) {
    // Redirect to dashboard after successful registration
    router.push("/");
  }
};

// Handle OAuth methods
const loginWithGoogle = () => {
  window.location.href = "/api/auth/google";
};

const loginWithGitHub = () => {
  window.location.href = "/api/auth/github";
};
</script>
