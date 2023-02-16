import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(AuthService) private authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const authHeader = ctx.getContext().req.headers.authorization;

    if (authHeader.includes('Bearer')) {
      const token = authHeader.split(' ')[1];
      const user = await this.authService.validateSessionBySignature(token);
      return !!user;
    } else {
      return false;
    }
  }
}
