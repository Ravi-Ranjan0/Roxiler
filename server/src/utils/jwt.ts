import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/env';

const JWT_SECRET = config.jwt.secret;
const JWT_EXPIRES_IN = config.jwt.expiresIn as SignOptions['expiresIn'];

if (!JWT_SECRET || !JWT_EXPIRES_IN) {
    throw new Error('JWT_SECRET or JWT_EXPIRES_IN is not defined');
  }

export const signToken = (payload: object) => {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN,
  };

  return jwt.sign(payload, JWT_SECRET, options);
};

const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}
