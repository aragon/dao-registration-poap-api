import { Module } from '@nestjs/common';
import { EthereumService } from './ethereum.service';
import { EthereumResolver } from './ethereum.resolver';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [EthereumService, EthereumResolver],
  exports: [EthereumService],
})
export class EthereumModule {}
