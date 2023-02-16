import { Headers, UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  GraphQLExecutionContext,
  Mutation,
  Resolver,
} from '@nestjs/graphql';
import { AuthGuard } from '../auth/auth.guard';
import { User } from './user.model';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  @UseGuards(AuthGuard)
  async findOrCreateUser(
    @Context() context: GraphQLExecutionContext,
    @Headers('message') message: string,
    @Args('address') address: string,
  ) {
    return this.userService.findOrCreateUserByAddress(address);
  }
}
