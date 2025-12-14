import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { OrganizationRole } from 'src/enums/organization-role.enum';

export class InviteMemberDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsEnum(OrganizationRole)
  @IsNotEmpty()
  role: OrganizationRole;
}
