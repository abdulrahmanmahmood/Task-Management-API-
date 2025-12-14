import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrganizationRole } from 'src/enums/organization-role.enum';

export class updateMemberDto {
  @IsEnum(OrganizationRole)
  @IsNotEmpty()
  role: OrganizationRole;
}
