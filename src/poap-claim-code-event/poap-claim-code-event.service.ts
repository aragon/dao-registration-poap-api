import { Injectable } from '@nestjs/common';
import { PoapClaimCodeService } from '../poap-claim-code/poap-claim-code.service';
import { PoapEventService } from '../poap-event/poap-event.service';

@Injectable()
export class PoapClaimCodeEventService {
  constructor(
    private readonly poapEventService: PoapEventService,
    private readonly poapClaimCodeService: PoapClaimCodeService,
  ) {}

  async getPoapClaimCodeEvent(eventId: number) {
    return this.poapEventService.getPoapEventById(eventId);
  }
}
