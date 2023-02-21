import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { Auth } from '../auth/auth.decorator';
import { AuthenticatedUser } from '../user/authenticated-user.decorator';
import { PoapClaimCodeStatistics } from './poap-claim-code-statistics.model';
import { PoapClaimCode } from './poap-claim-code.model';
import { PoapClaimCodeService } from './poap-claim-code.service';

@Resolver(PoapClaimCode)
export class PoapClaimCodeResolver {
  constructor(private readonly poapClaimCodeService: PoapClaimCodeService) {}

  @Auth()
  @Query(() => Boolean, { name: 'canClaimPoap' })
  async canClaimPoap(@AuthenticatedUser() user: User) {
    return this.poapClaimCodeService.canClaimPoap(user);
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
}
