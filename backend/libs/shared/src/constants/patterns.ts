export const PRODUCT_MESSAGE_PATTERNS = {
  GET_ALL: { cmd: 'get_all_products' },
  GET_ONE: { cmd: 'get_one_product' },
  CREATE: { cmd: 'create_product' },
  UPDATE: { cmd: 'update_product' },
  DELETE: { cmd: 'delete_product' },
};

export const AUTH_MESSAGE_PATTERNS = {
  LOGIN: { cmd: 'login' },
  LOGOUT: { cmd: 'logout' },
  REGISTER: { cmd: 'register' },
  FORGOT_PASSWORD: { cmd: 'forgot_password' },
  RESET_PASSWORD: { cmd: 'reset_password' },
};
