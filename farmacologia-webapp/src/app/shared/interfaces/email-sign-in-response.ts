import { User } from './user';

export interface EmailSignInResponse {
  message: string;
  data: User;
  token: string;
}
