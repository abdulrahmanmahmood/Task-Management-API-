import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthGWTPayload } from '../types/auth-jwtPayload';
import { Inject, Injectable } from '@nestjs/common';
import jwtConfig from 'src/config/jwt.config';
import type { ConfigType } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfiguration.secret as string,
    });
  }

  validate(payload: AuthGWTPayload) {
    return { id: payload.sub, username: payload.username };
  }
}
