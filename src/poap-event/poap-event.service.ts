import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PoapAuthService } from '../poap-auth/poap-auth.service';
import { PoapService } from '../poap/poap.service';
import { PrismaService } from '../prisma/prisma.service';
import { ImportPoapEventInput } from './inputs/import-poap-event.input';
import { PoapEvent } from './poap-event.model';

@Injectable()
export class PoapEventService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly poapService: PoapService,
    private readonly poapAuthService: PoapAuthService,
  ) {}

  async importPoapEvent({ externalId, secretCode }: ImportPoapEventInput) {
    const poapEvent = await this.prismaService.poapEvent.findUnique({
      where: {
        externalId,
      },
    });

    if (poapEvent) {
      throw new UnprocessableEntityException('Event already imported');
    }

    const externalPoapEvent = await this.poapService.getEventById(externalId);

    if (!externalPoapEvent) {
      throw new BadRequestException('Invalid event Id provided');
    }

    const authToken = await this.poapAuthService.getAuthToken();

    const claimCodes = await this.poapService.getQrCodesByEventId(
      externalId,
      authToken.authToken,
      secretCode,
    );

    const today = new Date();
    const eventExpiryDate = new Date(externalPoapEvent.expiry_date);

    if (today > eventExpiryDate) {
      throw new UnprocessableEntityException('Event expired');
    }

    const createdEvent = await this.prismaService.poapEvent.create({
      data: {
        secretCode,
        externalId,
        image: externalPoapEvent.image_url,
        createdAt: new Date(),
        expiresAt: new Date(externalPoapEvent.expiry_date),
      },
    });

    const unclaimedCodes = claimCodes.filter((claimCode) => !claimCode.claimed);

    await this.prismaService.poapClaimCode.createMany({
      data: unclaimedCodes.map((claimCode) => ({
        qrHash: claimCode.qr_hash,
        eventId: createdEvent.id,
        createdAt: new Date(),
      })),
    });

    return createdEvent;
  }

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
