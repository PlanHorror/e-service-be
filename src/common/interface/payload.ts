import { Role } from 'generated/prisma';

export interface TokenPayload {
  id: string;
  email: string;
  username: string;
  role: Role;
}
