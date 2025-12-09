import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Not, Repository } from 'typeorm';
import { QueryUsersDto } from './dto/QueryUsersDto.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersResponseDto } from './dto/users-respnose.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  create(createUserDto: CreateUserDto) {
    try {
      const user = this.usersRepository.create(createUserDto);
      return this.usersRepository.save(user);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findAll(query: QueryUsersDto): Promise<UsersResponseDto<User>> {
    const { limit = 10, orderBy = 'ASC', page = 1 } = query;
    const [data, total] = await this.usersRepository.findAndCount({
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'avatar',
        'createdAt',
        'updatedAt',
      ],
      order: {
        createdAt: orderBy,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const response = new UsersResponseDto<User>();
    response.data = data;
    response.total = total;
    response.page = page;
    response.limit = limit;
    return response;
  }

  async findOneById(id: string) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findOneByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }

  async updateHashedRefreshToken(
    userId: string,
    hashedRefreshToken: string | null,
  ) {
    return await this.usersRepository.update(
      { id: userId },
      { hashedRefreshToken },
    );
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.usersRepository.update(id, updateUserDto);
  }

  async updateResetPasswordCode(
    userId: string,
    resetPasswordCode: string | null,
  ) {
    return await this.usersRepository.update(
      { id: userId },
      { resetPasswordCode },
    );
  }

  async remove(id: string) {
    const result = await this.usersRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return;
  }
}
