export const AUTH_MESSAGE_PATTERNS = {
  LOGIN: { cmd: 'auth.signIn' },
  LOGOUT: { cmd: 'auth.signOut' },
  SIGNUP: { cmd: 'auth.signUp' },
  FORGOT_PASSWORD: { cmd: 'auth.forgotPassword' },
  RESET_PASSWORD: { cmd: 'auth.resetPassword' },
  REFRESH_TOKEN: { cmd: 'auth.refreshToken' },
  VALIDATE_GOOGLE: { cmd: 'auth.validateGoogleUser' },
  VALIDATE_GITHUB: { cmd: 'auth.validateGithubUser' },
};

export const USER_MESSAGE_PATTERNS = {
  CREATE: { cmd: 'users.createUser' },
  GET_ONE: { cmd: 'users.getUser' },
  GET_BY_EMAIL: { cmd: 'users.getUserByEmail' },
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
