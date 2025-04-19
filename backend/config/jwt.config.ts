import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  expiresIn: parseInt(process.env.JWT_EXPIRATION!, 10) || 3600,
}));
