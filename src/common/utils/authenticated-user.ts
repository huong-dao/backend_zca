import { AppRole } from './app-role';

export type AuthenticatedUser = {
  id: string;
  email: string;
  role: AppRole;
};
