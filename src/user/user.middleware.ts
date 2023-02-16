import { Injectable, NestMiddleware } from '@nestjs/common';
import { User } from '@prisma/client';
import { NextFunction } from 'express';
import { AuthService } from '../auth/auth.service';

interface RequestWithUser extends Request {
  user: User;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}
  async use(req: RequestWithUser, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'] ?? '';
    const token = authHeader.split(' ')[1];

    if (token) {
      req.user = await this.authService.validateSessionBySignature(token);
    }
    next();
  }
}
