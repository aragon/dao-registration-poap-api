import { Module } from '@nestjs/common';
import { PoapClaimCodeService } from './poap-claim-code.service';
import { PoapClaimCodeResolver } from './poap-claim-code.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PrismaModule, UserModule],
  providers: [PoapClaimCodeService, PoapClaimCodeResolver],
  exports: [PoapClaimCodeService],
})
export class PoapClaimCodeModule {}
