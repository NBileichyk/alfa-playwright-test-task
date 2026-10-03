export const LOGIN_PAGE_CONSTANTS = {
  loginButton: 'Login',
  logoutLink: /log\s*out/i,
  invalidLoginMessage: /wrong|invalid|incorrect|email|password|authentication/i,
  successfulLoginMessagePrefix: 'You are now logged in as',
  errorBackgroundColor: 'rgb(242, 222, 222)',
  successBackgroundColor: 'rgb(214, 236, 166)',
} as const;
