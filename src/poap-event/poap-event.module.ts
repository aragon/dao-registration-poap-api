import { Module } from '@nestjs/common';
import { PoapEventService } from './poap-event.service';
import { PoapEventResolver } from './poap-event.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PoapModule } from 'src/poap/poap.module';
import { PoapAuthModule } from 'src/poap-auth/poap-auth.module';

@Module({
  imports: [PrismaModule, PoapModule, PoapAuthModule],
  providers: [PoapEventService, PoapEventResolver],
  exports: [PoapEventService],
})
export class PoapEventModule {}
