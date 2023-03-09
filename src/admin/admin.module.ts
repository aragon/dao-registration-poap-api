import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminResolver } from './admin.resolver';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { PrismaModule } from '../prisma/prisma.module';
import { PoapEventModule } from '../poap-event/poap-event.module';
import { PoapModule } from '../poap/poap.module';
import { PoapAuthModule } from '../poap-auth/poap-auth.module';
import { PendingDaoRegistrySyncModule } from '../pending-dao-registry-sync/pending-dao-registry-sync.module';
import { PoapClaimCodeModule } from '../poap-claim-code/poap-claim-code.module';
import { EthereumModule } from '../ethereum/ethereum.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    PoapEventModule,
    PoapModule,
    PoapAuthModule,
    PendingDaoRegistrySyncModule,
    PoapClaimCodeModule,
    EthereumModule,
  ],
  providers: [AdminService, AdminResolver],
})
export class AdminModule {}
