<template>
  <div>
    <UCard class="max-w-3xl mx-auto">
      <template #header>
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold">User Profile</h1>
          <UBadge
            v-if="auth.user?.role"
            :color="getRoleBadgeColor(auth.user.role)"
          >
            {{ auth.user.role }}
          </UBadge>
        </div>
      </template>

      <div v-if="auth.loading" class="py-12 flex justify-center">
        <ULoader />
      </div>
      <div v-else>
        <UForm :state="formState" class="space-y-6" @submit="updateProfile">
          <!-- Basic Information Section -->
          <div>
            <h2 class="text-lg font-medium mb-4 border-b pb-2">
              Basic Information
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormGroup label="Username" name="username">
                <UInput v-model="formState.username" placeholder="Username" />
              </UFormGroup>

              <UFormGroup label="Email" name="email">
                <UInput
                  v-model="formState.email"
                  type="email"
                  placeholder="Email"
                  disabled
                />
                <template #hint>
                  <span class="text-xs text-gray-500"
                    >Email cannot be changed</span
                  >
                </template>
              </UFormGroup>

              <UFormGroup label="Full Name" name="fullName">
                <UInput v-model="formState.fullName" placeholder="Full Name" />
              </UFormGroup>

              <UFormGroup label="Job Title" name="jobTitle">
                <UInput v-model="formState.jobTitle" placeholder="Job Title" />
              </UFormGroup>
            </div>
          </div>

          <!-- Account Security Section -->
          <div>
            <h2 class="text-lg font-medium mb-4 border-b pb-2">
              Account Security
            </h2>
            <UFormGroup label="Current Password" name="currentPassword">
              <UInput
                v-model="formState.currentPassword"
                type="password"
                placeholder="Enter current password to change password"
              />
            </UFormGroup>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormGroup label="New Password" name="newPassword">
                <UInput
                  v-model="formState.newPassword"
                  type="password"
                  placeholder="New Password"
                />
              </UFormGroup>

              <UFormGroup label="Confirm New Password" name="confirmPassword">
                <UInput
                  v-model="formState.confirmPassword"
                  type="password"
                  placeholder="Confirm New Password"
                />
              </UFormGroup>
            </div>
          </div>

          <!-- Profile Picture Section -->
          <div>
            <h2 class="text-lg font-medium mb-4 border-b pb-2">
              Profile Picture
            </h2>
            <div class="flex items-center gap-6">
              <div
                class="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center"
              >
                <img
                  v-if="formState.avatar"
                  :src="formState.avatar"
                  alt="Profile Picture"
                  class="w-full h-full object-cover"
                />
                <UIcon
                  v-else
                  name="i-lucide-user"
                  class="text-4xl text-gray-400"
                />
              </div>
              <div>
                <UFormGroup>
                  <UInput
                    type="file"
                    accept="image/*"
                    @change="handleFileUpload"
                  />
                  <template #hint>
                    <span class="text-xs text-gray-500">
                      JPG, PNG or GIF, max 2MB
                    </span>
                  </template>
                </UFormGroup>
              </div>
            </div>
          </div>

          <!-- Notification Settings Section -->
          <div>
            <h2 class="text-lg font-medium mb-4 border-b pb-2">
              Notification Settings
            </h2>
            <div class="space-y-4">
              <UCheckbox
                v-model="formState.notifyTaskAssignment"
                label="Task assignment notifications"
              />
              <UCheckbox
                v-model="formState.notifyTaskUpdates"
                label="Task status update notifications"
              />
              <UCheckbox
                v-model="formState.notifyProjectUpdates"
                label="Project update notifications"
              />
              <UCheckbox
                v-model="formState.emailDigest"
                label="Weekly email digest"
              />
            </div>
          </div>

          <UAlert
            v-if="error"
            color="red"
            variant="soft"
            icon="i-lucide-alert-circle"
            :title="error"
            class="mt-4"
          />

          <UAlert
            v-if="successMessage"
            color="green"
            variant="soft"
            icon="i-lucide-check-circle"
            :title="successMessage"
            class="mt-4"
          />

          <div class="flex justify-end">
            <UButton
              type="submit"
              color="primary"
              :loading="isSubmitting"
              :disabled="isSubmitting"
            >
              Save Changes
            </UButton>
          </div>
        </UForm>
      </div>
    </UCard>
  </div>
</template>

<script setup>
import { useAuth } from "~/composables/useAuth";

// Define page metadata
definePageMeta({
  middleware: ["auth"],
});

const auth = useAuth();
const router = useRouter();

// Form state initialized with user data
const formState = ref({
  username: "",
  email: "",
  fullName: "",
  jobTitle: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
  avatar: "",
  notifyTaskAssignment: true,
  notifyTaskUpdates: true,
  notifyProjectUpdates: true,
  emailDigest: false,
});

// UI state
const isSubmitting = ref(false);
const error = ref("");
const successMessage = ref("");

// Load user data when component mounts
onMounted(async () => {
  if (!auth.isAuthenticated) {
    return router.push("/auth/login");
  }

  // Initialize form with user data
  if (auth.user) {
    formState.value = {
      ...formState.value,
      username: auth.user.username || "",
      email: auth.user.email || "",
      fullName: auth.user.fullName || "",
      jobTitle: auth.user.jobTitle || "",
      avatar: auth.user.avatar || "",
    };
  } else {
    await auth.fetchUser();

    // Retry initialization after user data is fetched
    if (auth.user) {
      formState.value = {
        ...formState.value,
        username: auth.user.username || "",
        email: auth.user.email || "",
        fullName: auth.user.fullName || "",
        jobTitle: auth.user.jobTitle || "",
        avatar: auth.user.avatar || "",
      };
    }
  }
});

// Get badge color based on user role
const getRoleBadgeColor = (role) => {
  switch (role) {
    case "admin":
      return "red";
    case "user":
      return "blue";
    case "guest":
      return "gray";
    default:
      return "gray";
  }
};

// Handle file upload for profile picture
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Check file size (2MB limit)
  if (file.size > 2 * 1024 * 1024) {
    error.value = "File size exceeds 2MB limit";
    return;
  }

  // Create a preview URL
  const reader = new FileReader();
  reader.onload = (e) => {
    formState.value.avatar = e.target.result;
  };
  reader.readAsDataURL(file);

  // In a real application, you would upload the file to your server or a file storage service
};

// Validate password change
const validatePasswordChange = () => {
  // If attempting to change password
  if (formState.value.newPassword || formState.value.confirmPassword) {
    // Current password required
    if (!formState.value.currentPassword) {
      error.value = "Current password is required to change password";
      return false;
    }

    // New password required
    if (!formState.value.newPassword) {
      error.value = "New password is required";
      return false;
    }

    // New password must be at least 8 characters
    if (formState.value.newPassword.length < 8) {
      error.value = "New password must be at least 8 characters";
      return false;
    }

    // Passwords must match
    if (formState.value.newPassword !== formState.value.confirmPassword) {
      error.value = "New passwords do not match";
      return false;
    }
  }

  return true;
};

// Update user profile
const updateProfile = async () => {
  error.value = "";
  successMessage.value = "";

  // Validate form
  if (!validatePasswordChange()) {
    return;
  }

  isSubmitting.value = true;

  try {
    // Prepare profile data to update
    const profileData = {
      username: formState.value.username,
      fullName: formState.value.fullName,
      jobTitle: formState.value.jobTitle,
      avatar: formState.value.avatar,
      // Include password fields only if changing password
      ...(formState.value.newPassword && {
        currentPassword: formState.value.currentPassword,
        newPassword: formState.value.newPassword,
      }),
      notificationSettings: {
        notifyTaskAssignment: formState.value.notifyTaskAssignment,
        notifyTaskUpdates: formState.value.notifyTaskUpdates,
        notifyProjectUpdates: formState.value.notifyProjectUpdates,
        emailDigest: formState.value.emailDigest,
      },
    };

    const success = await auth.updateProfile(profileData);

    if (success) {
      // Clear password fields
      formState.value.currentPassword = "";
      formState.value.newPassword = "";
      formState.value.confirmPassword = "";

      successMessage.value = "Profile updated successfully";
    }
  } catch (err) {
    error.value = err.message || "Failed to update profile";
  } finally {
    isSubmitting.value = false;
  }
};
</script>
