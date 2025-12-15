import { Type } from 'class-transformer';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

export class OrganizationResponseDto {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;

  @Type(() => UserResponseDto)
  Owner: UserResponseDto;

  memberCount: number;
}
