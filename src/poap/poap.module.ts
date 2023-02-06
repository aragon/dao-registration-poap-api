import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PoapService } from './poap.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [PoapService],
  exports: [PoapService],
})
export class PoapModule {}
