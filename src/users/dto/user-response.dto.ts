import { Exclude } from 'class-transformer';

export class UserResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'member';
  createdAt: Date;
  updatedAt: Date;
  @Exclude()
  password: string;
}
