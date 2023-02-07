import { Args, Query, Resolver } from '@nestjs/graphql';
import { PoapClaimCode } from './poap-claim-code.model';
import { PoapClaimCodeService } from './poap-claim-code.service';

@Resolver(PoapClaimCode)
export class PoapClaimCodeResolver {
  constructor(private readonly poapClaimCodeService: PoapClaimCodeService) {}

  @Query(() => [PoapClaimCode], { name: 'poapClaimCodes' })
  async poapClaimCodes(@Args('userAddress') userAddress: string) {
    return this.poapClaimCodeService.getClaimCodesForUser(userAddress);
  }
}
