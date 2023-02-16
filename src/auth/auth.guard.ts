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
  canActivate(context: ExecutionContext): boolean {
    console.log(
      '🚀 ~ file: auth.guard.ts:7 ~ AuthGuard ~ canActivate ~ context',
      context,
    );
    const ctx = GqlExecutionContext.create(context);
    const authHeader = ctx.getContext().req.headers.authorization;
    console.log(
      '🚀 ~ file: auth.guard.ts:15 ~ AuthGuard ~ canActivate ~ authHeader',
      authHeader,
    );
    const x = this.authService.getNonce();
    console.log('🚀 ~ file: auth.guard.ts:16 ~ AuthGuard ~ canActivate ~ x', x);
    return true;
  }
}
