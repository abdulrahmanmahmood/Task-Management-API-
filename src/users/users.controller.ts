import {
  Controller,
  Get,
  UseGuards,
  Request,
  Patch,
  Param,
  Body,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/enums/role.enums';
import { Roles } from 'src/common/decorators/roles.decorator';
import { QueryUsersDto } from './dto/QueryUsersDto.dto';

@Roles(Role.ADMIN)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Request() req) {
    console.log(req.user);
    const user = await this.usersService.findOneById(req.user.id);

    const { hashedRefreshToken, password, ...result } = user;
    return result;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Get()
  async findAll(@Query() query: QueryUsersDto) {
    return await this.usersService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOneById(id);
    const { hashedRefreshToken, password, ...result } = user;
    return result;
  }
}
