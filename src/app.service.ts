import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { PoapService } from './poap/poap.service';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly poapService: PoapService,
  ) {}

  getHello(): string {
    return process.env.NODE_ENV;
  }

  async getHealth(): Promise<boolean> {
    try {
      await this.prismaService.user.count();
    } catch (error) {
      console.error(error);
      throw new ServiceUnavailableException('Database is unhealthy');
    }

    try {
      const poapStatus = await this.poapService.healthCheck();

      if (!poapStatus) {
        throw new ServiceUnavailableException('POAP API is unhealthy');
      }
    } catch (error) {
      console.error(error);
      throw new ServiceUnavailableException('POAP API is unhealthy');
    }

    return true;
  }
}
