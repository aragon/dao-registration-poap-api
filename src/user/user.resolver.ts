import { Mutation, Resolver } from '@nestjs/graphql';
import { User as PrismaUser } from '@prisma/client';
import { Auth } from '../auth/auth.decorator';
import { AuthenticatedUser } from './authenticated-user.decorator';
import { User } from './user.model';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Auth({ isAdmin: true })
  @Mutation(() => User)
  async findOrCreateUser(@AuthenticatedUser() authUser: PrismaUser) {
    return this.userService.findOrCreateUserByAddress(authUser.address);
  }
}
