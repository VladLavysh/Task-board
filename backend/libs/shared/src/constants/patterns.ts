export const AUTH_MESSAGE_PATTERNS = {
  LOGIN: { cmd: 'auth.login' },
  LOGOUT: { cmd: 'auth.logout' },
  REGISTER: { cmd: 'auth.register' },
  FORGOT_PASSWORD: { cmd: 'auth.forgotPassword' },
  RESET_PASSWORD: { cmd: 'auth.resetPassword' },
};

export const PROJECT_MESSAGE_PATTERNS = {
  GET_ALL: { cmd: 'projects.getAllProjects' },
  GET_ONE: { cmd: 'projects.getProject' },
  CREATE: { cmd: 'projects.createProject' },
  UPDATE: { cmd: 'projects.updateProject' },
  DELETE: { cmd: 'projects.deleteProject' },
};
