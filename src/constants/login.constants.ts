export const LOGIN_PAGE_CONSTANTS = {
  loginButton: 'Login',
  logoutLink: /log\s*out/i,
  invalidLoginMessage: /wrong|invalid|incorrect|email|password|authentication/i,
  successfulLoginMessagePrefix: 'You are now logged in as',
} as const;
