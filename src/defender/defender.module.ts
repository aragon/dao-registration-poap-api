import { Module } from '@nestjs/common';
import { DefenderService } from './defender.service';
import { DefenderController } from './defender.controller';
import { PoapClaimCodeModule } from '../poap-claim-code/poap-claim-code.module';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PoapClaimCodeModule, UserModule, ConfigModule],
  providers: [DefenderService],
  controllers: [DefenderController],
})
export class DefenderModule {}
