export const LOGIN_PAGE_CONSTANTS = {
  loginButton: 'Login',
  logoutLink: /log\s*out/i,
  invalidLoginMessage: /wrong|invalid|incorrect|email|password|authentication/i,
  successfulLoginMessagePrefix: 'You are now logged in as',
  errorBackgroundColor: 'rgb(255, 204, 204)',
  successBackgroundColor: 'rgb(214, 236, 166)',
} as const;
