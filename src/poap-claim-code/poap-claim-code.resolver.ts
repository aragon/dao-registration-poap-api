import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from '../auth/auth.guard';
import { PoapClaimCodeStatistics } from './poap-claim-code-statistics.model';
import { PoapClaimCode } from './poap-claim-code.model';
import { PoapClaimCodeService } from './poap-claim-code.service';

@Resolver(PoapClaimCode)
export class PoapClaimCodeResolver {
  constructor(private readonly poapClaimCodeService: PoapClaimCodeService) {}

  @UseGuards(AuthGuard)
  @Query(() => Boolean, { name: 'canClaimPoap' })
  async canClaimPoap(@Args('userAddress') userAddress: string) {
    return this.poapClaimCodeService.canClaimPoap(userAddress);
  }

  @Query(() => Boolean, { name: 'isMinted' })
  async isMinted(@Args('qrHash') qrHash: string) {
    return this.poapClaimCodeService.isMinted(qrHash);
  }

  @UseGuards(AuthGuard)
  @Query(() => PoapClaimCode, { name: 'mintedClaimCode', nullable: true })
  async mintedClaimCode(@Args('userAddress') userAddress: string) {
    return this.poapClaimCodeService.mintedClaimCode(userAddress);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => PoapClaimCode, { name: 'mintPoap' })
  async mintPoap(@Args('userAddress') userAddress: string) {
    return this.poapClaimCodeService.mintClaimCode(userAddress);
  }

  @Query(() => PoapClaimCodeStatistics, { name: 'poapClaimCodeStatistics' })
  async poapClaimCodeStatistics() {
    return this.poapClaimCodeService.getClaimCodeStatistics();
  }
}
