import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrganizationRole } from '../../enums/organization-role.enum';

export class UpdateMemberDto {
  @IsEnum(OrganizationRole)
  @IsNotEmpty()
  role: OrganizationRole;
}
