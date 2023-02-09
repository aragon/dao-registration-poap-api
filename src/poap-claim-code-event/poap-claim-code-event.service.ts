import { Injectable } from '@nestjs/common';
import { PoapEventService } from '../poap-event/poap-event.service';

@Injectable()
export class PoapClaimCodeEventService {
  constructor(private readonly poapEventService: PoapEventService) {}

  async getPoapClaimCodeEvent(eventId: number) {
    return this.poapEventService.getPoapEventById(eventId);
  }
}
