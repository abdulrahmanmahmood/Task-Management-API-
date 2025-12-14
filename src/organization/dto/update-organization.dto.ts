import { PartialType } from '@nestjs/swagger';
import { CreateOrganizationDto } from './create-organization.dto';
import { Exclude } from 'class-transformer';

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {
  @Exclude()
  OwnerId?: string;
}
