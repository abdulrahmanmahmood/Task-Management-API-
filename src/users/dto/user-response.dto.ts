import { Exclude } from 'class-transformer';
import { OrganizationRole } from 'src/enums/organization-role.enum';

export class UserResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: OrganizationRole;
  createdAt: Date;
  updatedAt: Date;
  @Exclude()
  password: string;

  @Exclude()
  hashedRefreshToken: string | null;

  @Exclude()
  resetPasswordCode: string | null;
}
