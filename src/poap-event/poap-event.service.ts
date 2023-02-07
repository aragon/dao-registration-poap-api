import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PoapAuthService } from 'src/poap-auth/poap-auth.service';
import { PoapService } from 'src/poap/poap.service';
import { PrismaService } from 'src/prisma/prisma.service';
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
    const poapEvent = await this.prismaService.pOAPEvent.findUnique({
      where: {
        externalId,
      },
    });

    if (poapEvent) {
      throw new UnprocessableEntityException('Event already imported');
    }

    const externalPoapEventResponse = await this.poapService.getEventById(
      externalId,
    );

    if (!externalPoapEventResponse) {
      throw new BadRequestException('Invalid event Id provided');
    }

    const authToken = await this.poapAuthService.getAuthToken();

    const claimCodes = await this.poapService.getQrCodesByEventId(
      externalId,
      authToken.authToken,
      secretCode,
    );

    const createdEvent = await this.prismaService.pOAPEvent.create({
      data: {
        secretCode,
        externalId,
        image: externalPoapEventResponse.image_url,
        createdAt: new Date(),
      },
    });

    const unclaimedCodes = claimCodes.filter((claimCode) => !claimCode.claimed);

    await this.prismaService.pOAPClaimCode.createMany({
      data: unclaimedCodes.map((claimCode) => ({
        qrHash: claimCode.qr_hash,
        eventId: createdEvent.id,
        createdAt: new Date(),
        allowListId: null,
      })),
    });

    return createdEvent;
  }

  async getPOAPEvent(externalId: number): Promise<PoapEvent> {
    const poapEvent = await this.prismaService.pOAPEvent.findUnique({
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
