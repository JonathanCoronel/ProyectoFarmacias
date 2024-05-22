import { Role } from './role';

export interface User {
  id: string;
  username?: string;
  ci?: string;
  photoURL?: string;
  photo?: string;
  displayName: string;
  name?: string;
  lastname?: string;
  dateofbirth?: string;
  idrole?: number;
  points?: number;
  email: string;
  provider: string;
  idprovider?: any;
  accesstoken?: any;
  role?: Role;
  uid: string;
}

export interface UserClaims {
  isAdmin: boolean;
  isStudent: boolean;
}


