import { Module } from '@nestjs/common';
import { PoapEventService } from './poap-event.service';
import { PoapEventResolver } from './poap-event.resolver';

@Module({
  providers: [PoapEventService, PoapEventResolver]
})
export class PoapEventModule {}
