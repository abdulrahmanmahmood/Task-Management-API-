import {
  Controller,
  Get,
  UseGuards,
  Request,
  Patch,
  Param,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

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

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
}
