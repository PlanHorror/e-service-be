import { Role } from '@prisma/client';

export interface CreateUser {
  email: string;
  username: string;
  password: string;
  full_name?: string;
  phone?: string;
  address?: string;
  role: Role;
  is_active: boolean;
}
