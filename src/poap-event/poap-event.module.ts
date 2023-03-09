import { Module } from '@nestjs/common';
import { PoapEventService } from './poap-event.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PoapModule } from '../poap/poap.module';
import { PoapAuthModule } from '../poap-auth/poap-auth.module';

@Module({
  imports: [PrismaModule, PoapModule, PoapAuthModule],
  providers: [PoapEventService],
  exports: [PoapEventService],
})
export class PoapEventModule {}
