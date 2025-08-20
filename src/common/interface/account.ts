import { Role } from 'generated/prisma';

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
