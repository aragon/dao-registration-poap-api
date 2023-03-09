import { Injectable } from '@nestjs/common';
import { PoapAuth } from '@prisma/client';
import { subHours } from 'date-fns';
import { PoapService } from '../poap/poap.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PoapAuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly poapService: PoapService,
  ) {}

  async getAuthToken(): Promise<PoapAuth> {
    const authToken = await this.prismaService.poapAuth.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!authToken) {
      return this.createAuthToken();
    }

    if (authToken.createdAt < subHours(new Date(), 23)) {
      return this.refreshAuthToken(authToken.id);
    }

    return authToken;
  }

  private async createAuthToken() {
    const authToken = await this.poapService.generateAuthToken();

    return this.prismaService.poapAuth.create({
      data: {
        authToken,
        createdAt: new Date(),
      },
    });
  }

  private async refreshAuthToken(id: number) {
    const authToken = await this.poapService.generateAuthToken();

    return this.prismaService.poapAuth.update({
      where: {
        id,
      },
      data: {
        authToken,
        createdAt: new Date(),
      },
    });
  }
}
