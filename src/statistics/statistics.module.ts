import { Module } from '@nestjs/common';
import { StatisticsResolver } from './statistics.resolver';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { PendingDaoRegistrySyncModule } from '../pending-dao-registry-sync/pending-dao-registry-sync.module';
import { AuthModule } from '../auth/auth.module';
import { PoapClaimCodeModule } from '../poap-claim-code/poap-claim-code.module';
import { PoapEventModule } from '../poap-event/poap-event.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PendingDaoRegistrySyncModule,
    AuthModule,
    PoapClaimCodeModule,
    PoapEventModule,
    ConfigModule,
  ],
  providers: [StatisticsResolver, StatisticsService],
  controllers: [StatisticsController],
})
export class StatisticsModule {}
