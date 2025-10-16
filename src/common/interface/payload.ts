import { Role } from '@prisma/client';

export interface TokenPayload {
  id: string;
  username: string;
  email: string;
  role: Role;
}
