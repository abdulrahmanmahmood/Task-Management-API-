import { IsNotEmpty, IsString } from 'class-validator';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

export class AuthResponseDto {
  @IsNotEmpty()
  @IsString()
  accessToken: string;

  user: UserResponseDto;

  refreshToken?: string;
}
