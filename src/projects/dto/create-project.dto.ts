import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ProjectStatus } from '../enums/project-status.enum';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
  @IsOptional()
  @IsDate()
  startDate?: Date;
  @IsOptional()
  @IsDate()
  endDate?: Date;
  @IsString()
  @IsNotEmpty()
  OrganizationId: string;
}
