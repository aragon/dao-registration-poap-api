import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { User } from '@prisma/client';
import { Auth } from '../auth/auth.decorator';
import { AuthenticatedUser } from '../user/authenticated-user.decorator';
import { User as UserModel } from '../user/user.model';
import { PoapClaimCode } from './poap-claim-code.model';
import { PoapClaimCodeService } from './poap-claim-code.service';

@Resolver(PoapClaimCode)
export class PoapClaimCodeResolver {
  constructor(private readonly poapClaimCodeService: PoapClaimCodeService) {}

  @Query(() => Boolean, { name: 'canClaimPoap' })
  async canClaimPoap(@Args('address') address: string) {
    return this.poapClaimCodeService.canClaimPoap(address);
  }

  @Query(() => Boolean, { name: 'isMinted' })
  async isMinted(
    @AuthenticatedUser() user: User,
    @Args('qrHash') qrHash: string,
  ) {
    return this.poapClaimCodeService.isMinted(qrHash);
  }

  @Auth()
  @Query(() => PoapClaimCode, { name: 'mintedClaimCode', nullable: true })
  async mintedClaimCode(@AuthenticatedUser() user: User) {
    return this.poapClaimCodeService.mintedClaimCode(user);
  }

  @Auth()
  @Mutation(() => PoapClaimCode, { name: 'mintPoap' })
  async mintPoap(@AuthenticatedUser() user: User) {
    return this.poapClaimCodeService.mintClaimCode(user);
  }

  @ResolveField(() => UserModel)
  async user(@Parent() poapClaimCode: PoapClaimCode) {
    return this.poapClaimCodeService.getUserForClaimCode(poapClaimCode.id);
  }
}
