import { Module } from '@nestjs/common';
import { PoapClaimCodeService } from './poap-claim-code.service';
import { PoapClaimCodeResolver } from './poap-claim-code.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { PoapModule } from '../poap/poap.module';
import { PoapAuthModule } from '../poap-auth/poap-auth.module';
import { PoapEventModule } from '../poap-event/poap-event.module';
import { PendingDaoRegistrySyncModule } from '../pending-dao-registry-sync/pending-dao-registry-sync.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    PoapModule,
    PoapAuthModule,
    PoapEventModule,
    UserModule,
    PendingDaoRegistrySyncModule,
  ],
  providers: [PoapClaimCodeService, PoapClaimCodeResolver],
  exports: [PoapClaimCodeService],
})
export class PoapClaimCodeModule {}
