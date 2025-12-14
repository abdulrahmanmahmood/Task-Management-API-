import { Expose, Type } from 'class-transformer';
import { OrganizationRole } from 'src/enums/organization-role.enum';

class UserInfo {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  avatar: string;
}

export class MemberResponseDto {
  @Expose()
  id: string;

  @Expose()
  role: OrganizationRole;

  @Expose()
  joinedAt: Date;

  @Expose()
  @Type(() => UserInfo)
  user: UserInfo;
}
