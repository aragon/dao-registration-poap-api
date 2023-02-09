import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PoapClaimCodeStatistics } from './poap-claim-code-statistics.model';
import { PoapClaimCode } from './poap-claim-code.model';
import { PoapClaimCodeService } from './poap-claim-code.service';

@Resolver(PoapClaimCode)
export class PoapClaimCodeResolver {
  constructor(private readonly poapClaimCodeService: PoapClaimCodeService) {}

  @Query(() => Boolean, { name: 'canClaimPOAP' })
  async canClaimPOAP(@Args('userAddress') userAddress: string) {
    return this.poapClaimCodeService.canClaimPOAP(userAddress);
  }

  @Query(() => Boolean, { name: 'isMinted' })
  async isMinted(@Args('qrHash') qrHash: string) {
    return this.poapClaimCodeService.isMinted(qrHash);
  }

  @Query(() => PoapClaimCode, { name: 'mintedClaimCode' })
  async mintedClaimCode(@Args('userAddress') userAddress: string) {
    return this.poapClaimCodeService.mintedClaimCode(userAddress);
  }

  @Mutation(() => PoapClaimCode, { name: 'mintPOAP' })
  async mintPOAP(@Args('userAddress') userAddress: string) {
    return this.poapClaimCodeService.mintClaimCode(userAddress);
  }

  @Query(() => PoapClaimCodeStatistics, { name: 'poapClaimCodeStatistics' })
  async poapClaimCodeStatistics() {
    return this.poapClaimCodeService.getClaimCodeStatistics();
  }
}
