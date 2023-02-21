import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PendingDaoRegistrySyncService } from './pending-dao-registry-sync.service';

@Module({
  imports: [PrismaModule],
  providers: [PendingDaoRegistrySyncService],
  exports: [PendingDaoRegistrySyncService],
})
export class PendingDaoRegistrySyncModule {}
