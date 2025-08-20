import { Role } from 'generated/prisma';

export interface TokenPayload {
  id: string;
  username: string;
  role: Role;
}
