import { getSession, signOut, recordUserLogin } from './internal/services';

export const api = {
  getSession,
  signOut,
  recordUserLogin
};