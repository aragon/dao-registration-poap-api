import { Injectable, NotFoundException } from '@nestjs/common';
import { PoapAuthService } from '../poap-auth/poap-auth.service';
import { PoapService } from '../poap/poap.service';
import { PrismaService } from '../prisma/prisma.service';
import { PoapEvent } from './poap-event.model';

@Injectable()
export class PoapEventService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly poapService: PoapService,
    private readonly poapAuthService: PoapAuthService,
  ) {}

  async getPoapEventById(id: number): Promise<PoapEvent> {
    const poapEvent = await this.prismaService.poapEvent.findUnique({
      where: {
        id,
      },
    });

    if (!poapEvent) {
      throw new NotFoundException('Event not found');
    }

    return poapEvent;
  }

  async getPoapEventByExternalId(externalId: number): Promise<PoapEvent> {
    return this.prismaService.poapEvent.findUnique({
      where: {
        externalId,
      },
    });
  }

  async getAllPoapEvents(): Promise<PoapEvent[]> {
    return this.prismaService.poapEvent.findMany();
  }

  async getActivePoapEvents(): Promise<PoapEvent[]> {
    const today = new Date();

    return this.prismaService.poapEvent.findMany({
      where: {
        expiresAt: {
          gt: today,
        },
      },
    });
  }

  async getPoapEvent(externalId: number): Promise<PoapEvent> {
    const poapEvent = await this.prismaService.poapEvent.findUnique({
      where: {
        externalId,
      },
    });

    if (!poapEvent) {
      throw new NotFoundException('Event not found');
    }

    return poapEvent;
  }
}
