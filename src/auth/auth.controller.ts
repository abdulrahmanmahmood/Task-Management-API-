import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user.id);
  }

  @Post('refresh-token')
  @UseGuards(RefreshAuthGuard)
  async refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user.id);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Request() req) {
    const userId = req.user.id;
    return this.authService.logout(userId);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async resetPassword(@Body() body: { email: string }) {
    return this.authService.resetPassword(body.email);
  }

  @Post('change-password')
  async changePassword(
    @Request() request,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    console.log('chagnePasswordDto in controller', changePasswordDto);
    return await this.authService.changePassword(
      request.user.id,
      changePasswordDto,
    );
  }
}
