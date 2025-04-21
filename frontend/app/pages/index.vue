<template>
  <div>
    <!-- Welcome section for all users -->
    <div class="mb-10">
      <h1 class="text-3xl font-bold mb-2">
        {{ greeting }}, {{ auth.user?.username || "Guest" }}
      </h1>
      <p class="text-gray-500">
        Here's what's happening with your projects today.
      </p>
    </div>

    <div v-if="auth.isAuthenticated">
      <!-- Dashboard content for authenticated users -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <UCard class="bg-primary-50">
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold">Projects</h3>
              <UIcon name="i-lucide-briefcase" class="text-primary text-xl" />
            </div>
          </template>
          <div class="text-3xl font-bold mb-2">{{ projectsCount }}</div>
          <p class="text-sm text-gray-500">
            {{ newProjectsCount }} new in the last 30 days
          </p>
          <template #footer>
            <NuxtLink
              to="/projects"
              class="text-primary text-sm hover:underline flex items-center"
            >
              View all projects
              <UIcon name="i-lucide-arrow-right" class="ml-1" />
            </NuxtLink>
          </template>
        </UCard>

        <UCard class="bg-indigo-50">
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold">Tasks</h3>
              <UIcon
                name="i-lucide-check-square"
                class="text-indigo-500 text-xl"
              />
            </div>
          </template>
          <div class="text-3xl font-bold mb-2">{{ tasksCount }}</div>
          <p class="text-sm text-gray-500">
            {{ completedTasksCount }} completed, {{ pendingTasksCount }} pending
          </p>
          <template #footer>
            <NuxtLink
              to="/tasks"
              class="text-indigo-500 text-sm hover:underline flex items-center"
            >
              View all tasks
              <UIcon name="i-lucide-arrow-right" class="ml-1" />
            </NuxtLink>
          </template>
        </UCard>

        <UCard class="bg-orange-50">
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold">Due Soon</h3>
              <UIcon name="i-lucide-calendar" class="text-orange-500 text-xl" />
            </div>
          </template>
          <div class="text-3xl font-bold mb-2">{{ dueSoonTasksCount }}</div>
          <p class="text-sm text-gray-500">Tasks due in the next 7 days</p>
          <template #footer>
            <NuxtLink
              to="/tasks?filter=due-soon"
              class="text-orange-500 text-sm hover:underline flex items-center"
            >
              View urgent tasks
              <UIcon name="i-lucide-arrow-right" class="ml-1" />
            </NuxtLink>
          </template>
        </UCard>
      </div>

      <!-- Recent projects section -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">Recent Projects</h2>
          <NuxtLink to="/projects" class="text-primary hover:underline text-sm">
            View all
          </NuxtLink>
        </div>

        <div v-if="projects.loading" class="flex justify-center py-10">
          <ULoader />
        </div>

        <div
          v-else-if="recentProjects.length === 0"
          class="text-center py-10 bg-gray-50 rounded-lg"
        >
          <UIcon
            name="i-lucide-folder"
            class="text-4xl text-gray-400 mx-auto mb-2"
          />
          <p class="text-gray-500">No projects found</p>
          <UButton to="/projects/new" color="primary" class="mt-4">
            Create your first project
          </UButton>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UCard
            v-for="project in recentProjects"
            :key="project.id"
            class="group"
          >
            <template #header>
              <div class="flex justify-between items-center">
                <h3
                  class="font-medium text-lg group-hover:text-primary truncate"
                >
                  {{ project.name }}
                </h3>
                <UBadge :color="getProjectStatusColor(project.status)">
                  {{ project.status }}
                </UBadge>
              </div>
            </template>

            <p class="text-gray-500 text-sm line-clamp-2 mb-2">
              {{ project.description }}
            </p>

            <div class="flex justify-between text-xs text-gray-500">
              <div>
                <UIcon name="i-lucide-calendar" class="inline mr-1" />
                Started: {{ formatDate(project.startDate) }}
              </div>
              <div v-if="project.endDate">
                <UIcon name="i-lucide-flag" class="inline mr-1" />
                Due: {{ formatDate(project.endDate) }}
              </div>
            </div>

            <template #footer>
              <div class="flex justify-between items-center">
                <div class="flex items-center">
                  <UIcon name="i-lucide-list-todo" class="mr-1 text-gray-500" />
                  <span class="text-sm"
                    >{{ getProjectTaskCount(project.id) }} tasks</span
                  >
                </div>
                <UButton
                  to="`/projects/${project.id}`"
                  color="gray"
                  variant="ghost"
                  icon="i-lucide-eye"
                  size="xs"
                >
                  View
                </UButton>
              </div>
            </template>
          </UCard>
        </div>
      </div>

      <!-- Recent activity section -->
      <div>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">Recent Activity</h2>
        </div>

        <UCard>
          <UTimeline>
            <UTimelineItem
              v-for="(activity, index) in recentActivity"
              :key="index"
            >
              <template #icon>
                <UIcon
                  :name="getActivityIcon(activity.type)"
                  class="text-primary"
                />
              </template>
              <template #title>
                <span class="font-medium">{{ activity.title }}</span>
              </template>
              <template #description>
                <span class="text-gray-500">{{ activity.description }}</span>
              </template>
              <template #time>
                <span class="text-xs text-gray-500">{{
                  formatTimeAgo(activity.timestamp)
                }}</span>
              </template>
            </UTimelineItem>
          </UTimeline>
        </UCard>
      </div>
    </div>

    <!-- Guest content -->
    <div v-else class="py-10">
      <div class="max-w-3xl mx-auto text-center">
        <UIcon
          name="i-lucide-layout-kanban"
          class="text-primary text-5xl mx-auto mb-6"
        />
        <h2 class="text-4xl font-bold mb-4">Get organized with Task Board</h2>
        <p class="text-xl text-gray-500 mb-8">
          Manage your projects and tasks efficiently with our powerful yet
          simple task management system.
        </p>
        <div class="flex justify-center gap-4">
          <UButton to="/auth/register" color="primary" size="lg">
            Get Started
          </UButton>
          <UButton to="/auth/login" color="gray" variant="outline" size="lg">
            Sign In
          </UButton>
        </div>
      </div>

      <!-- Features overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        <div class="text-center">
          <UIcon
            name="i-lucide-briefcase"
            class="text-primary text-3xl mx-auto mb-4"
          />
          <h3 class="text-xl font-bold mb-2">Project Management</h3>
          <p class="text-gray-500">
            Create and manage projects with deadlines, descriptions, and custom
            status tracking.
          </p>
        </div>
        <div class="text-center">
          <UIcon
            name="i-lucide-list-checks"
            class="text-primary text-3xl mx-auto mb-4"
          />
          <h3 class="text-xl font-bold mb-2">Task Tracking</h3>
          <p class="text-gray-500">
            Break down projects into manageable tasks and track progress with
            our intuitive interface.
          </p>
        </div>
        <div class="text-center">
          <UIcon
            name="i-lucide-users"
            class="text-primary text-3xl mx-auto mb-4"
          />
          <h3 class="text-xl font-bold mb-2">Collaboration</h3>
          <p class="text-gray-500">
            Work together with team members and assign tasks to the right
            people.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from "~/composables/useAuth";
import { useProjects } from "~/composables/useProjects";
import { useTasks } from "~/composables/useTasks";
import { format, parseISO, formatDistanceToNow } from "date-fns";

const auth = useAuth();
const projects = useProjects();
const tasks = useTasks();

// Greeting based on time of day
const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
});

// Fetch projects and tasks when authenticated
onMounted(async () => {
  if (auth.isAuthenticated) {
    await projects.fetchProjects();
  }
});

// Recent projects (last 5)
const recentProjects = computed(() => {
  return projects.sortedProjects.slice(0, 4);
});

// Project stats
const projectsCount = computed(() => projects.projects.length || 0);
const newProjectsCount = computed(() => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return projects.projects.filter((p) => {
    const createdAt = new Date(p.createdAt);
    return createdAt >= thirtyDaysAgo;
  }).length;
});

// Task stats (mocked data for now)
const tasksCount = ref(23);
const completedTasksCount = ref(12);
const pendingTasksCount = ref(11);
const dueSoonTasksCount = ref(4);

// Utility function to get project task count
const getProjectTaskCount = (projectId) => {
  // This would typically come from your API
  return Math.floor(Math.random() * 10) + 1;
};

// Utility function for formatting dates
const formatDate = (dateString) => {
  if (!dateString) return "Not set";
  try {
    return format(parseISO(dateString), "MMM d, yyyy");
  } catch (e) {
    return dateString;
  }
};

// Utility function for formatting relative time
const formatTimeAgo = (dateString) => {
  try {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
  } catch (e) {
    return dateString;
  }
};

// Get color for project status badge
const getProjectStatusColor = (status) => {
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

// Get icon for activity type
const getActivityIcon = (type) => {
  switch (type) {
    case "project_created":
      return "i-lucide-folder-plus";
    case "project_updated":
      return "i-lucide-folder-pen";
    case "task_created":
      return "i-lucide-plus-square";
    case "task_completed":
      return "i-lucide-check-square";
    default:
      return "i-lucide-activity";
  }
};

// Sample recent activity data
const recentActivity = ref([
  {
    type: "project_created",
    title: "New Project Created",
    description: 'You created the project "Website Redesign"',
    timestamp: "2025-04-20T14:30:00Z",
  },
  {
    type: "task_completed",
    title: "Task Completed",
    description:
      'You completed the task "Create wireframes" in "Website Redesign"',
    timestamp: "2025-04-19T09:15:00Z",
  },
  {
    type: "task_created",
    title: "New Task Added",
    description:
      'You added the task "Implement login page" to "Website Redesign"',
    timestamp: "2025-04-18T16:45:00Z",
  },
  {
    type: "project_updated",
    title: "Project Updated",
    description: 'You updated the deadline for "Mobile App Development"',
    timestamp: "2025-04-17T11:20:00Z",
  },
]);
</script>
