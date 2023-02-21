import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SiweSessionInput } from './inputs/siwe-session.input';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => String, { name: 'nonce' })
  getNonce() {
    return this.authService.getNonce().nonce;
  }

  @Mutation(() => Boolean, { name: 'login' })
  async login(@Args('data') data: SiweSessionInput) {
    const validMessage = await this.authService.verify(data);
    return validMessage;
  }
}
