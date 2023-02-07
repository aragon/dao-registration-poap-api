import { Injectable } from '@nestjs/common';
import { POAPAuth } from '@prisma/client';
import { subHours } from 'date-fns';
import { PoapService } from 'src/poap/poap.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PoapAuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly poapService: PoapService,
  ) {}

  async createAuthToken() {
    const authToken = await this.poapService.generateAuthToken();

    return this.prismaService.pOAPAuth.create({
      data: {
        authToken,
        createdAt: new Date(),
      },
    });
  }

  async refreshAuthToken(id: number) {
    const authToken = await this.poapService.generateAuthToken();

    return this.prismaService.pOAPAuth.update({
      where: {
        id,
      },
      data: {
        authToken,
        createdAt: new Date(),
      },
    });
  }

  async getAuthToken(): Promise<POAPAuth> {
    const authToken = await this.prismaService.pOAPAuth.findFirst({
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
}
