<template>
  <div>
    <!-- Loading state -->
    <div v-if="isLoading" class="py-12 flex justify-center">
      <ULoader size="lg" />
    </div>

    <!-- Project not found -->
    <div v-else-if="!project" class="py-12">
      <UCard class="max-w-md mx-auto text-center">
        <UIcon
          name="i-lucide-file-question"
          class="text-5xl text-gray-300 mx-auto mb-4"
        />
        <h2 class="text-lg font-medium mb-2">Project Not Found</h2>
        <p class="text-gray-500 mb-6">
          The project you're looking for doesn't exist or you don't have access
          to it.
        </p>
        <UButton to="/projects" color="primary"> Back to Projects </UButton>
      </UCard>
    </div>

    <!-- Project details -->
    <div v-else>
      <!-- Project header -->
      <div
        class="flex flex-col md:flex-row md:items-start md:justify-between mb-6"
      >
        <div>
          <div class="flex items-center gap-2 mb-1">
            <UBadge :color="getStatusColor(project.status)">
              {{ project.status }}
            </UBadge>
            <span class="text-sm text-gray-500">
              Created {{ formatTimeAgo(project.createdAt) }}
            </span>
          </div>
          <h1 class="text-3xl font-bold mb-2">{{ project.name }}</h1>
          <p class="text-gray-500 mb-4 max-w-3xl">
            {{ project.description }}
          </p>
          <div class="flex flex-wrap gap-4 text-sm">
            <div class="flex items-center">
              <UIcon name="i-lucide-calendar" class="mr-1 text-gray-500" />
              <span class="text-gray-500">Start Date:</span>
              <span class="ml-1 font-medium">{{
                formatDate(project.startDate)
              }}</span>
            </div>
            <div class="flex items-center">
              <UIcon name="i-lucide-flag" class="mr-1 text-gray-500" />
              <span class="text-gray-500">End Date:</span>
              <span class="ml-1 font-medium">{{
                formatDate(project.endDate)
              }}</span>
            </div>
            <div class="flex items-center">
              <UIcon name="i-lucide-list-todo" class="mr-1 text-gray-500" />
              <span class="text-gray-500">Tasks:</span>
              <span class="ml-1 font-medium">{{ tasks.tasks.length }}</span>
            </div>
          </div>
        </div>
        <div class="flex gap-2 mt-4 md:mt-0">
          <UButton
            color="gray"
            variant="soft"
            icon="i-lucide-edit"
            :to="`/projects/${id}/edit`"
          >
            Edit
          </UButton>
          <UButton
            color="primary"
            icon="i-lucide-plus"
            @click="openCreateTaskModal"
          >
            Add Task
          </UButton>
        </div>
      </div>

      <!-- Tasks section -->
      <div class="mb-6">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <h2 class="text-xl font-bold">Tasks</h2>
                <UBadge color="gray" variant="subtle">{{
                  tasks.tasks.length
                }}</UBadge>
              </div>
              <div class="flex items-center gap-2">
                <UInput
                  v-model="taskSearch"
                  icon="i-lucide-search"
                  placeholder="Search tasks..."
                  size="sm"
                />
                <USelectMenu
                  v-model="taskStatusFilter"
                  :options="taskStatusOptions"
                  placeholder="All statuses"
                  size="sm"
                />
              </div>
            </div>
          </template>

          <!-- Task board -->
          <div v-if="tasks.loading" class="py-12 flex justify-center">
            <ULoader />
          </div>
          <div v-else-if="filteredTasks.length === 0" class="py-12 text-center">
            <UIcon
              name="i-lucide-clipboard-list"
              class="text-5xl text-gray-300 mx-auto mb-4"
            />
            <h3 class="text-lg font-medium mb-2">No tasks found</h3>
            <p class="text-gray-500 mb-6">
              {{
                taskSearch || taskStatusFilter
                  ? "Try a different search term or filter."
                  : "Create your first task to get started."
              }}
            </p>
            <UButton
              color="primary"
              icon="i-lucide-plus"
              @click="openCreateTaskModal"
            >
              Add Task
            </UButton>
          </div>
          <div v-else>
            <!-- Task Kanban board -->
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">
              <!-- To Do column -->
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="font-medium">To Do</h3>
                  <UBadge color="gray" variant="subtle">
                    {{ getTasksByStatus("To Do").length }}
                  </UBadge>
                </div>
                <div class="space-y-3">
                  <TaskCard
                    v-for="task in getTasksByStatus('To Do')"
                    :key="task.id"
                    :task="task"
                    @click="openTaskDetails(task)"
                    @status-change="updateTaskStatus"
                  />
                </div>
              </div>

              <!-- In Progress column -->
              <div class="bg-blue-50 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="font-medium">In Progress</h3>
                  <UBadge color="blue" variant="subtle">
                    {{ getTasksByStatus("In Progress").length }}
                  </UBadge>
                </div>
                <div class="space-y-3">
                  <TaskCard
                    v-for="task in getTasksByStatus('In Progress')"
                    :key="task.id"
                    :task="task"
                    @click="openTaskDetails(task)"
                    @status-change="updateTaskStatus"
                  />
                </div>
              </div>

              <!-- In Review column -->
              <div class="bg-amber-50 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="font-medium">In Review</h3>
                  <UBadge color="amber" variant="subtle">
                    {{ getTasksByStatus("In Review").length }}
                  </UBadge>
                </div>
                <div class="space-y-3">
                  <TaskCard
                    v-for="task in getTasksByStatus('In Review')"
                    :key="task.id"
                    :task="task"
                    @click="openTaskDetails(task)"
                    @status-change="updateTaskStatus"
                  />
                </div>
              </div>

              <!-- Completed column -->
              <div class="bg-green-50 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="font-medium">Completed</h3>
                  <UBadge color="green" variant="subtle">
                    {{ getTasksByStatus("Completed").length }}
                  </UBadge>
                </div>
                <div class="space-y-3">
                  <TaskCard
                    v-for="task in getTasksByStatus('Completed')"
                    :key="task.id"
                    :task="task"
                    @click="openTaskDetails(task)"
                    @status-change="updateTaskStatus"
                  />
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Create task modal -->
    <UModal v-model="isCreateTaskModalOpen" :ui="{ width: 'md' }">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Add New Task</h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-lucide-x"
              :padded="false"
              @click="isCreateTaskModalOpen = false"
            />
          </div>
        </template>

        <UForm :state="newTask" class="space-y-4" @submit="createTask">
          <UFormGroup label="Task Title" name="title" required>
            <UInput v-model="newTask.title" placeholder="Enter task title" />
          </UFormGroup>

          <UFormGroup label="Description" name="description">
            <UTextarea
              v-model="newTask.description"
              placeholder="Enter task description"
              rows="3"
            />
          </UFormGroup>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormGroup label="Priority" name="priority">
              <USelectMenu
                v-model="newTask.priority"
                :options="priorityOptions"
              />
            </UFormGroup>

            <UFormGroup label="Status" name="status">
              <USelectMenu v-model="newTask.status" :options="statusOptions" />
            </UFormGroup>
          </div>

          <UFormGroup label="Due Date" name="dueDate">
            <UInput v-model="newTask.dueDate" type="date" />
          </UFormGroup>
        </UForm>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              color="gray"
              variant="soft"
              @click="isCreateTaskModalOpen = false"
            >
              Cancel
            </UButton>
            <UButton
              color="primary"
              :loading="tasks.loading"
              @click="createTask"
            >
              Add Task
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Task details modal -->
    <UModal
      v-if="selectedTask"
      v-model="isTaskDetailsModalOpen"
      :ui="{ width: 'lg' }"
    >
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <h3 class="text-lg font-semibold">{{ selectedTask.title }}</h3>
              <UBadge :color="getTaskStatusColor(selectedTask.status)">
                {{ selectedTask.status }}
              </UBadge>
            </div>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-lucide-x"
              :padded="false"
              @click="isTaskDetailsModalOpen = false"
            />
          </div>
        </template>

        <div class="space-y-4">
          <!-- Task description -->
          <div>
            <h4 class="text-sm text-gray-500 mb-1">Description</h4>
            <p class="text-gray-900">
              {{ selectedTask.description || "No description provided." }}
            </p>
          </div>

          <!-- Task details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 class="text-sm text-gray-500 mb-1">Priority</h4>
              <div class="flex items-center">
                <UBadge :color="getTaskPriorityColor(selectedTask.priority)">
                  {{ selectedTask.priority }}
                </UBadge>
              </div>
            </div>
            <div>
              <h4 class="text-sm text-gray-500 mb-1">Due Date</h4>
              <p class="text-gray-900">
                {{ formatDate(selectedTask.dueDate) }}
              </p>
            </div>
          </div>

          <!-- Task status -->
          <div>
            <h4 class="text-sm text-gray-500 mb-1">Status</h4>
            <USelectMenu
              v-model="selectedTask.status"
              :options="statusOptions"
              class="w-full"
              @change="handleTaskStatusChange"
            />
          </div>
        </div>

        <template #footer>
          <div class="flex justify-between">
            <UButton
              color="red"
              variant="soft"
              icon="i-lucide-trash-2"
              @click="confirmDeleteTask"
            >
              Delete
            </UButton>
            <div class="flex gap-2">
              <UButton
                color="gray"
                variant="soft"
                @click="isTaskDetailsModalOpen = false"
              >
                Close
              </UButton>
              <UButton
                color="primary"
                icon="i-lucide-edit"
                @click="openEditTask"
              >
                Edit
              </UButton>
            </div>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Delete task confirmation modal -->
    <UModal v-model="isDeleteTaskModalOpen" :ui="{ width: 'sm' }">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-red-500">Delete Task</h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-lucide-x"
              :padded="false"
              @click="isDeleteTaskModalOpen = false"
            />
          </div>
        </template>

        <p>
          Are you sure you want to delete the task "{{ selectedTask?.title }}"?
          This action cannot be undone.
        </p>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              color="gray"
              variant="soft"
              @click="isDeleteTaskModalOpen = false"
            >
              Cancel
            </UButton>
            <UButton color="red" :loading="tasks.loading" @click="deleteTask">
              Delete Task
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { useProjects } from "~/composables/useProjects";
import { useTasks } from "~/composables/useTasks";
import { format, parseISO, formatDistanceToNow } from "date-fns";

// Define page metadata
definePageMeta({
  middleware: ["auth"],
});

// Components
// We'll define a TaskCard component to represent each task in the Kanban board
const TaskCard = defineComponent({
  name: "TaskCard",
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  emits: ["click", "status-change"],
  setup(props, { emit }) {
    const getPriorityColor = (priority) => {
      switch (priority) {
        case "Low":
          return "gray";
        case "Medium":
          return "blue";
        case "High":
          return "amber";
        case "Critical":
          return "red";
        default:
          return "gray";
      }
    };

    return () =>
      h(
        "div",
        {
          class:
            "bg-white rounded-md p-3 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow",
          onClick: () => emit("click", props.task),
        },
        [
          h("div", { class: "flex justify-between items-start mb-2" }, [
            h(
              "h4",
              { class: "font-medium text-gray-900 line-clamp-2" },
              props.task.title
            ),
            h(
              "UBadge",
              {
                color: getPriorityColor(props.task.priority),
                variant: "subtle",
                size: "xs",
              },
              props.task.priority
            ),
          ]),
          props.task.description &&
            h(
              "p",
              { class: "text-xs text-gray-500 line-clamp-2 mb-3" },
              props.task.description
            ),
          h(
            "div",
            {
              class: "flex justify-between items-center text-xs text-gray-500",
            },
            [
              props.task.dueDate &&
                h("div", {}, [
                  h("UIcon", {
                    name: "i-lucide-calendar",
                    class: "inline mr-1",
                  }),
                  format(parseISO(props.task.dueDate), "MMM d"),
                ]),
              h(
                "UDropdown",
                {
                  items: [
                    {
                      label: "To Do",
                      click: () => emit("status-change", props.task, "To Do"),
                    },
                    {
                      label: "In Progress",
                      click: () =>
                        emit("status-change", props.task, "In Progress"),
                    },
                    {
                      label: "In Review",
                      click: () =>
                        emit("status-change", props.task, "In Review"),
                    },
                    {
                      label: "Completed",
                      click: () =>
                        emit("status-change", props.task, "Completed"),
                    },
                  ],
                  trigger: "click",
                  placement: "bottom-end",
                  onClickOutside: (e) => e.stopPropagation(),
                },
                {
                  default: () =>
                    h("UButton", {
                      color: "gray",
                      variant: "ghost",
                      icon: "i-lucide-more-vertical",
                      padded: false,
                      size: "xs",
                      onClick: (e) => e.stopPropagation(),
                    }),
                }
              ),
            ]
          ),
        ]
      );
  },
});

const route = useRoute();
const router = useRouter();
const projects = useProjects();
const tasks = useTasks();

// Get project ID from route params
const id = route.params.id;

// State
const isLoading = ref(true);
const project = ref(null);
const taskSearch = ref("");
const taskStatusFilter = ref(null);

// Task modals
const isCreateTaskModalOpen = ref(false);
const isTaskDetailsModalOpen = ref(false);
const isDeleteTaskModalOpen = ref(false);
const selectedTask = ref(null);

// New task form
const newTask = ref({
  title: "",
  description: "",
  priority: "Medium",
  status: "To Do",
  dueDate: "",
});

// Options for task form
const priorityOptions = [
  { label: "Low", value: "Low" },
  { label: "Medium", value: "Medium" },
  { label: "High", value: "High" },
  { label: "Critical", value: "Critical" },
];

const statusOptions = [
  { label: "To Do", value: "To Do" },
  { label: "In Progress", value: "In Progress" },
  { label: "In Review", value: "In Review" },
  { label: "Completed", value: "Completed" },
  { label: "Blocked", value: "Blocked" },
];

const taskStatusOptions = [
  { label: "All Statuses", value: null },
  ...statusOptions,
];

// Fetch project and tasks data
onMounted(async () => {
  try {
    // Fetch project details
    project.value = await projects.fetchProject(id);

    if (project.value) {
      // Fetch tasks for this project
      await tasks.fetchTasks(id);
    }
  } catch (error) {
    console.error("Error loading project:", error);
  } finally {
    isLoading.value = false;
  }
});

// Format date
const formatDate = (dateString) => {
  if (!dateString) return "Not set";
  try {
    return format(parseISO(dateString), "MMM d, yyyy");
  } catch (e) {
    return dateString;
  }
};

// Format time ago
const formatTimeAgo = (dateString) => {
  try {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
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

// Get task status color
const getTaskStatusColor = (status) => {
  switch (status) {
    case "To Do":
      return "gray";
    case "In Progress":
      return "blue";
    case "In Review":
      return "amber";
    case "Completed":
      return "green";
    case "Blocked":
      return "red";
    default:
      return "gray";
  }
};

// Get task priority color
const getTaskPriorityColor = (priority) => {
  switch (priority) {
    case "Low":
      return "gray";
    case "Medium":
      return "blue";
    case "High":
      return "amber";
    case "Critical":
      return "red";
    default:
      return "gray";
  }
};

// Filtered tasks based on search and status filter
const filteredTasks = computed(() => {
  let result = [...tasks.tasks];

  // Apply search filter
  if (taskSearch.value) {
    const search = taskSearch.value.toLowerCase();
    result = result.filter(
      (task) =>
        task.title.toLowerCase().includes(search) ||
        (task.description && task.description.toLowerCase().includes(search))
    );
  }

  // Apply status filter
  if (taskStatusFilter.value) {
    result = result.filter((task) => task.status === taskStatusFilter.value);
  }

  return result;
});

// Get tasks by status for Kanban columns
const getTasksByStatus = (status) => {
  return filteredTasks.value.filter((task) => task.status === status);
};

// Open create task modal
const openCreateTaskModal = () => {
  // Reset form
  newTask.value = {
    title: "",
    description: "",
    priority: "Medium",
    status: "To Do",
    dueDate: "",
  };
  isCreateTaskModalOpen.value = true;
};

// Create new task
const createTask = async () => {
  // Add projectId to task data
  const taskData = {
    ...newTask.value,
    projectId: id,
  };

  const success = await tasks.createTask(id, taskData);
  if (success) {
    isCreateTaskModalOpen.value = false;
  }
};

// Open task details modal
const openTaskDetails = (task) => {
  selectedTask.value = { ...task };
  isTaskDetailsModalOpen.value = true;
};

// Handle task status change
const handleTaskStatusChange = async () => {
  if (!selectedTask.value) return;

  await updateTaskStatus(selectedTask.value, selectedTask.value.status);
};

// Update task status
const updateTaskStatus = async (task, newStatus) => {
  await tasks.updateTaskStatus(id, task.id, newStatus);
};

// Open edit task modal
const openEditTask = () => {
  // This would typically open an edit modal
  // For now, we'll just close the details modal
  isTaskDetailsModalOpen.value = false;
};

// Confirm delete task
const confirmDeleteTask = () => {
  isTaskDetailsModalOpen.value = false;
  isDeleteTaskModalOpen.value = true;
};

// Delete task
const deleteTask = async () => {
  if (!selectedTask.value) return;

  const success = await tasks.deleteTask(id, selectedTask.value.id);
  if (success) {
    isDeleteTaskModalOpen.value = false;
    selectedTask.value = null;
  }
};
</script>
