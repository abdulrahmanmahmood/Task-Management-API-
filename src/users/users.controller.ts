import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    console.log(req.user);
    const user = await this.usersService.findOneById(req.user.id);
    const { hashedRefreshToken, ...result } = user;
    return result;
  }
}
