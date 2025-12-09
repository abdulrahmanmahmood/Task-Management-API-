import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { AuthGWTPayload } from './types/auth-jwtPayload';
import type { ConfigType } from '@nestjs/config';
import refreshJwtConfig from 'src/config/refresh-jwt.config';
import { identity } from 'rxjs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private readonly refreshJwtOptions: ConfigType<typeof refreshJwtConfig>,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      console.log('registerDto', registerDto);
      const existingUser = await this.userService.findOneByEmail(
        registerDto.email,
      );

      if (existingUser) {
        throw new BadRequestException('User with this email already exists');
      }
      // Hash the password before saving the user
      const hashedPassword = await this.hashPassword(registerDto.password);

      const user = this.userService.create({
        ...registerDto,
        password: hashedPassword,
      });

      return user;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async login(userId: string) {
    const { refreshToken, accessToken } = await this.generateTokens(userId);
    const hashedRefreshToken = await argon2.hash(refreshToken);

    await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken);
    return {
      userId,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(userId: string) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRefreshToken = await argon2.hash(refreshToken);

    await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken);
    return {
      userId,
      accessToken,
      refreshToken,
    };
  }
  async validateUser(email: string, password: string) {
    try {
      const user = await this.userService.findOneByEmail(email);
      if (!user) {
        throw new BadRequestException('Invalid credentials');
      }
      const isPasswordValid = await argon2.verify(user.password, password);
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid credentials');
      }
      return {
        id: user.id,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  async generateTokens(userId: string) {
    const user = await this.userService.findOneById(userId);
    const payload: AuthGWTPayload = { sub: userId, username: user.email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.refreshJwtOptions.secret,
        expiresIn: this.refreshJwtOptions.expiresIn,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async validateRefreshToken(userId: string, refreshToken: string) {
    const user = await this.userService.findOneById(userId.toString());
    if (!user || !user.hashedRefreshToken)
      throw new UnauthorizedException('Unauthorized');
    const refreshTokenMatches = await argon2.verify(
      user.hashedRefreshToken,
      refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Unauthorized');
    }
    return {
      id: user.id,
    };
  }

  async logout(userId: string) {
    await this.userService.updateHashedRefreshToken(userId, null);
  }

  async resetPassword(email: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      // For security, do not reveal that the email does not exist
      return;
    }
    // TODO Implement the logic to send a password reset email or token here
  }

  async validateJwtUser(userId: string) {
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    const curentUser = { id: user.id, role: user.role };
    return curentUser;
  }
}
