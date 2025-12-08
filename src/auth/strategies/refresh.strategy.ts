import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthGWTPayload } from '../types/auth-jwtPayload';
import { Inject, Injectable } from '@nestjs/common';
import jwtConfig from 'src/config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import refreshJwtConfig from 'src/config/refresh-jwt.config';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(
    @Inject(refreshJwtConfig.KEY)
    private refreshJwtConfiguration: ConfigType<typeof refreshJwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: refreshJwtConfiguration.secret as string,
    });
  }

  validate(payload: AuthGWTPayload) {
    return { id: payload.sub, username: payload.username };
  }
}
