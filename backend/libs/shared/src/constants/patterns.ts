export const AUTH_MESSAGE_PATTERNS = {
  LOGIN: { cmd: 'auth.signIn' },
  LOGOUT: { cmd: 'auth.signOut' },
  FORGOT_PASSWORD: { cmd: 'auth.forgotPassword' },
  RESET_PASSWORD: { cmd: 'auth.resetPassword' },
  REFRESH_TOKEN: { cmd: 'auth.refreshToken' },
};

export const USER_MESSAGE_PATTERNS = {
  CREATE: { cmd: 'users.createUser' },
  GET_ONE: { cmd: 'users.getUser' },
  UPDATE: { cmd: 'users.updateUser' },
};

export const PROJECT_MESSAGE_PATTERNS = {
  GET_ALL: { cmd: 'projects.getAllProjects' },
  GET_ONE: { cmd: 'projects.getProject' },
  CREATE: { cmd: 'projects.createProject' },
  UPDATE: { cmd: 'projects.updateProject' },
  DELETE: { cmd: 'projects.deleteProject' },
};

export const TASK_MESSAGE_PATTERNS = {
  GET_ALL: { cmd: 'tasks.getAllTasks' },
  GET_ONE: { cmd: 'tasks.getTask' },
  CREATE: { cmd: 'tasks.createTask' },
  UPDATE: { cmd: 'tasks.updateTask' },
  DELETE: { cmd: 'tasks.deleteTask' },
};
