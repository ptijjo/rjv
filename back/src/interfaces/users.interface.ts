export interface User {
  id: string;
  email: string;
  password?: string | null;
  googleId?: string | null;
  pseudo: string;
  avatar: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  lastConnection?: Date | null;
}
