import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    export interface Request {
      user: JwtPayload | null;
    }
  }
}

