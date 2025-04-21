<template>
  <div>
    <!-- Page header -->
    <div
      class="flex flex-col md:flex-row md:items-center md:justify-between mb-6"
    >
      <div>
        <h1 class="text-3xl font-bold">Projects</h1>
        <p class="text-gray-500 mt-1">Manage and organize your work</p>
      </div>
      <div class="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="Search projects..."
          class="w-full sm:w-auto"
          @input="handleSearch"
        />
        <UButton
          color="primary"
          icon="i-lucide-plus"
          @click="openCreateProjectModal"
        >
          New Project
        </UButton>
      </div>
    </div>

    <!-- Project filters -->
    <UCard class="mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <UFormGroup label="Status">
            <USelectMenu
              v-model="filters.status"
              :options="statusOptions"
              placeholder="All statuses"
              @change="fetchProjects"
            />
          </UFormGroup>
        </div>
        <div>
          <UFormGroup label="Sort By">
            <USelectMenu
              v-model="sortBy"
              :options="sortOptions"
              @change="handleSort"
            />
          </UFormGroup>
        </div>
        <div>
          <UFormGroup label="View">
            <UButtonGroup
              :model-value="viewType"
              @update:model-value="setViewType"
            >
              <UButton
                value="grid"
                color="gray"
                variant="ghost"
                icon="i-lucide-grid"
                :padded="false"
              />
              <UButton
                value="list"
                color="gray"
                variant="ghost"
                icon="i-lucide-list"
                :padded="false"
              />
            </UButtonGroup>
          </UFormGroup>
        </div>
      </div>
    </UCard>

    <!-- Loading state -->
    <div v-if="projects.loading" class="py-12 flex justify-center">
      <ULoader size="lg" />
    </div>

    <!-- Empty state -->
    <UCard v-else-if="filteredProjects.length === 0" class="py-12">
      <div class="text-center">
        <UIcon
          name="i-lucide-folder"
          class="text-5xl text-gray-300 mx-auto mb-4"
        />
        <h3 class="text-lg font-medium mb-2">No projects found</h3>
        <p class="text-gray-500 mb-6">
          {{
            searchQuery
              ? "Try a different search term or filter."
              : "Create your first project to get started."
          }}
        </p>
        <UButton
          color="primary"
          icon="i-lucide-plus"
          @click="openCreateProjectModal"
        >
          Create Project
        </UButton>
      </div>
    </UCard>

    <!-- Grid view -->
    <div
      v-else-if="viewType === 'grid'"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <UCard
        v-for="project in filteredProjects"
        :key="project.id"
        class="group"
      >
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-semibold text-lg group-hover:text-primary truncate">
              {{ project.name }}
            </h3>
            <UDropdown :items="getProjectActions(project)">
              <UButton
                color="gray"
                variant="ghost"
                icon="i-lucide-more-vertical"
                :padded="false"
              />
            </UDropdown>
          </div>
        </template>

        <div>
          <UBadge class="mb-2" :color="getStatusColor(project.status)">
            {{ project.status }}
          </UBadge>
          <p class="text-gray-500 text-sm line-clamp-3 mb-3">
            {{ project.description }}
          </p>

          <div class="text-xs text-gray-500 flex justify-between">
            <div>
              <UIcon name="i-lucide-calendar" class="inline mr-1" />
              {{ formatDate(project.startDate) }}
            </div>
            <div v-if="project.endDate">
              <UIcon name="i-lucide-flag" class="inline mr-1" />
              {{ formatDate(project.endDate) }}
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-between items-center">
            <span class="text-sm">
              <UIcon name="i-lucide-list-todo" class="inline mr-1" />
              {{ project.taskCount || 0 }} tasks
            </span>
            <UButton
              :to="`/projects/${project.id}`"
              color="primary"
              variant="soft"
              size="sm"
            >
              View Project
            </UButton>
          </div>
        </template>
      </UCard>
    </div>

    <!-- List view -->
    <UTable
      v-else
      :columns="tableColumns"
      :rows="filteredProjects"
      :loading="projects.loading"
    >
      <template #name-data="{ row }">
        <div class="flex items-center">
          <UIcon name="i-lucide-folder" class="mr-2 text-primary" />
          <NuxtLink
            :to="`/projects/${row.id}`"
            class="font-medium hover:text-primary hover:underline"
          >
            {{ row.name }}
          </NuxtLink>
        </div>
      </template>

      <template #status-data="{ row }">
        <UBadge :color="getStatusColor(row.status)">
          {{ row.status }}
        </UBadge>
      </template>

      <template #dates-data="{ row }">
        <div class="text-sm">
          <div>
            <span class="text-gray-500">Start:</span>
            {{ formatDate(row.startDate) }}
          </div>
          <div v-if="row.endDate">
            <span class="text-gray-500">End:</span>
            {{ formatDate(row.endDate) }}
          </div>
        </div>
      </template>

      <template #tasks-data="{ row }">
        <span>{{ row.taskCount || 0 }}</span>
      </template>

      <template #actions-data="{ row }">
        <UDropdown :items="getProjectActions(row)">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-lucide-more-vertical"
            :padded="false"
          />
        </UDropdown>
      </template>
    </UTable>

    <!-- Create project modal -->
    <UModal v-model="isCreateModalOpen" :ui="{ width: 'md' }">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Create New Project</h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-lucide-x"
              :padded="false"
              @click="isCreateModalOpen = false"
            />
          </div>
        </template>

        <UForm :state="newProject" class="space-y-4" @submit="createProject">
          <UFormGroup label="Project Name" name="name" required>
            <UInput
              v-model="newProject.name"
              placeholder="Enter project name"
            />
          </UFormGroup>

          <UFormGroup label="Description" name="description" required>
            <UTextarea
              v-model="newProject.description"
              placeholder="Enter project description"
              rows="3"
            />
          </UFormGroup>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormGroup label="Start Date" name="startDate">
              <UInput v-model="newProject.startDate" type="date" />
            </UFormGroup>

            <UFormGroup label="End Date" name="endDate">
              <UInput v-model="newProject.endDate" type="date" />
            </UFormGroup>
          </div>

          <UFormGroup label="Status" name="status">
            <USelectMenu v-model="newProject.status" :options="statusOptions" />
          </UFormGroup>
        </UForm>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              color="gray"
              variant="soft"
              @click="isCreateModalOpen = false"
            >
              Cancel
            </UButton>
            <UButton
              color="primary"
              :loading="projects.loading"
              @click="createProject"
            >
              Create Project
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Delete confirmation modal -->
    <UModal v-model="isDeleteModalOpen" :ui="{ width: 'sm' }">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-red-500">Delete Project</h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-lucide-x"
              :padded="false"
              @click="isDeleteModalOpen = false"
            />
          </div>
        </template>

        <p>
          Are you sure you want to delete the project "{{
            projectToDelete?.name
          }}"? This action cannot be undone.
        </p>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              color="gray"
              variant="soft"
              @click="isDeleteModalOpen = false"
            >
              Cancel
            </UButton>
            <UButton
              color="red"
              :loading="projects.loading"
              @click="confirmDeleteProject"
            >
              Delete Project
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
import { useProjects } from "~/composables/useProjects";
import { format, parseISO } from "date-fns";

// Define page metadata
definePageMeta({
  middleware: ["auth"],
});

const projects = useProjects();
const router = useRouter();

// View state
const viewType = ref("grid");
const searchQuery = ref("");
const sortBy = ref("updatedAt");

// Filters
const filters = ref({
  status: null,
});

// Modal state
const isCreateModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const projectToDelete = ref(null);

// New project form
const newProject = ref({
  name: "",
  description: "",
  startDate: "",
  endDate: "",
  status: "Not Started",
});

// Table columns for list view
const tableColumns = [
  {
    key: "name",
    label: "Project Name",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "dates",
    label: "Dates",
  },
  {
    key: "tasks",
    label: "Tasks",
  },
  {
    key: "actions",
    label: "",
  },
];

// Status options
const statusOptions = [
  { label: "All Statuses", value: null },
  { label: "Not Started", value: "Not Started" },
  { label: "Ongoing", value: "Ongoing" },
  { label: "Finished", value: "Finished" },
];

// Sort options
const sortOptions = [
  { label: "Last Updated", value: "updatedAt" },
  { label: "Name", value: "name" },
  { label: "Created Date", value: "createdAt" },
  { label: "Due Date", value: "endDate" },
];

// Fetch projects on component mount
onMounted(() => {
  fetchProjects();
});

// Fetch projects with current filters
const fetchProjects = async () => {
  await projects.fetchProjects(filters.value);
};

// Set view type
const setViewType = (type) => {
  viewType.value = type;
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return "Not set";
  try {
    return format(parseISO(dateString), "MMM d, yyyy");
  } catch (e) {
    return dateString;
  }
};

// Get status color
const getStatusColor = (status) => {
  switch (status) {
    case "Not Started":
      return "gray";
    case "Ongoing":
      return "blue";
    case "Finished":
      return "green";
    default:
      return "gray";
  }
};

// Search projects
const handleSearch = _.debounce(() => {
  fetchProjects();
}, 300);

// Sort projects
const handleSort = () => {
  // Handle sorting logic
};

// Project actions dropdown
const getProjectActions = (project) => [
  [
    {
      label: "View",
      icon: "i-lucide-eye",
      click: () => router.push(`/projects/${project.id}`),
    },
    {
      label: "Edit",
      icon: "i-lucide-edit",
      click: () => router.push(`/projects/${project.id}/edit`),
    },
  ],
  [
    {
      label: "Delete",
      icon: "i-lucide-trash-2",
      click: () => openDeleteModal(project),
    },
  ],
];

// Filtered projects based on search and filters
const filteredProjects = computed(() => {
  let result = [...projects.projects];

  // Apply search filter
  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase();
    result = result.filter(
      (project) =>
        project.name.toLowerCase().includes(search) ||
        project.description.toLowerCase().includes(search)
    );
  }

  // Apply status filter
  if (filters.value.status) {
    result = result.filter(
      (project) => project.status === filters.value.status
    );
  }

  // Apply sorting
  result.sort((a, b) => {
    if (sortBy.value === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy.value === "createdAt") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy.value === "endDate") {
      if (!a.endDate) return 1;
      if (!b.endDate) return -1;
      return new Date(a.endDate) - new Date(b.endDate);
    } else {
      // Default sort by updatedAt
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    }
  });

  return result;
});

// Open create project modal
const openCreateProjectModal = () => {
  // Reset form
  newProject.value = {
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "Not Started",
  };
  isCreateModalOpen.value = true;
};

// Create new project
const createProject = async () => {
  const success = await projects.createProject(newProject.value);
  if (success) {
    isCreateModalOpen.value = false;
    await fetchProjects();
  }
};

// Open delete confirmation modal
const openDeleteModal = (project) => {
  projectToDelete.value = project;
  isDeleteModalOpen.value = true;
};

// Confirm project deletion
const confirmDeleteProject = async () => {
  if (!projectToDelete.value) return;

  const success = await projects.deleteProject(projectToDelete.value.id);
  if (success) {
    isDeleteModalOpen.value = false;
    projectToDelete.value = null;
    await fetchProjects();
  }
};
</script>
