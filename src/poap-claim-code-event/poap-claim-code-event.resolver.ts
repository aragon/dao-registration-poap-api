import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PoapClaimCode } from '../poap-claim-code/poap-claim-code.model';
import { PoapEvent } from '../poap-event/poap-event.model';
import { PoapClaimCodeEventService } from './poap-claim-code-event.service';

@Resolver(PoapClaimCode)
export class PoapClaimCodeEventResolver {
  constructor(
    private readonly poapClaimCodeEventService: PoapClaimCodeEventService,
  ) {}

  @ResolveField(() => PoapEvent)
  async event(@Parent() poapClaimCode: PoapClaimCode) {
    return this.poapClaimCodeEventService.getPOAPClaimCodeEvent(
      poapClaimCode.eventId,
    );
  }
}
