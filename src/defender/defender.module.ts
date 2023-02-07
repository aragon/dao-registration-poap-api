import { Module } from '@nestjs/common';
import { DefenderService } from './defender.service';
import { DefenderController } from './defender.controller';
import { PoapClaimCodeModule } from '../poap-claim-code/poap-claim-code.module';

@Module({
  imports: [PoapClaimCodeModule],
  providers: [DefenderService],
  controllers: [DefenderController],
})
export class DefenderModule {}
