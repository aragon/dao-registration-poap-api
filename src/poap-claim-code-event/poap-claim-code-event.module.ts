import { Module } from '@nestjs/common';
import { PoapClaimCodeEventService } from './poap-claim-code-event.service';
import { PoapClaimCodeEventResolver } from './poap-claim-code-event.resolver';
import { PoapClaimCodeModule } from '../poap-claim-code/poap-claim-code.module';
import { PoapEventModule } from '../poap-event/poap-event.module';

@Module({
  imports: [PoapClaimCodeModule, PoapEventModule],
  providers: [PoapClaimCodeEventService, PoapClaimCodeEventResolver],
})
export class PoapClaimCodeEventModule {}
