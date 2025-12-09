import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthGWTPayload } from '../types/auth-jwtPayload';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import jwtConfig from 'src/config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import refreshJwtConfig from 'src/config/refresh-jwt.config';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(
    @Inject(refreshJwtConfig.KEY)
    private refreshJwtConfiguration: ConfigType<typeof refreshJwtConfig>,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: refreshJwtConfiguration.secret as string,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: AuthGWTPayload) {
    const refreshToken = req.body?.refreshToken;
    console.log('refreshToken from body', refreshToken);
    if (!refreshToken) {
      throw new UnauthorizedException('Unauthorized');
    }
    const userId = payload.sub;

    return this.authService.validateRefreshToken(userId, refreshToken);
  }
}
