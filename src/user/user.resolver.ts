import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from './user.model';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  async findOrCreateUser(@Args('address') address: string) {
    return this.userService.findUserByAddressOrCreate(address);
  }
}
