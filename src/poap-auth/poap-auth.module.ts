import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PoapModule } from 'src/poap/poap.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PoapAuthService } from './poap-auth.service';

@Module({
  imports: [ConfigModule, PrismaModule, PoapModule],
  providers: [PoapAuthService],
  exports: [PoapAuthService],
})
export class PoapAuthModule {}
