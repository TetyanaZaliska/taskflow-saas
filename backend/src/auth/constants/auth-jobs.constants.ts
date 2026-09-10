export const AuthMailJobs = {
  SEND_WELCOME_EMAIL: 'send-welcome-email',
} as const;

export const AUTH_MAIL_QUEUE = 'auth-mail' as const;

export type AuthMailJobs = (typeof AuthMailJobs)[keyof typeof AuthMailJobs];
