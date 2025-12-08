import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export default registerAs<JwtModuleOptions>('jwt', () => ({
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: '1m' as any,
  },
}));
