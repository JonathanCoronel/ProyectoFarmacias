import { User } from './user';

export interface EmailSignInResponse {
  data: User;
  token: string;
}
