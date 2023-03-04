import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PoapAuthService } from '../poap-auth/poap-auth.service';
import { ImportPoapEventInput } from './inputs/import-poap-event.input';
import { PoapEventService } from '../poap-event/poap-event.service';
import { PoapService } from '../poap/poap.service';
import { PrismaService } from '../prisma/prisma.service';
import { PoapClaimCodeService } from '../poap-claim-code/poap-claim-code.service';
import { BulkActionResult } from './bulk-action-result.model';
import { UserService } from '../user/user.service';
import { EthereumService } from '../ethereum/ethereum.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly poapService: PoapService,
    private readonly poapAuthService: PoapAuthService,
    private readonly poapEventService: PoapEventService,
    private readonly poapClaimCodeService: PoapClaimCodeService,
    private readonly userService: UserService,
    private readonly ethereumService: EthereumService,
  ) {}

  async importPoapEvent({ externalId, secretCode }: ImportPoapEventInput) {
    const poapEvent = await this.poapEventService.getPoapEventByExternalId(
      externalId,
    );

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

  async reassingPendingSyncAttempts(
    pendingCodesCount: number,
    creatorAddress: string = undefined,
  ): Promise<BulkActionResult> {
    const creator = creatorAddress
      ? await this.userService.findOrCreateUserByAddress(creatorAddress)
      : undefined;

    const pendingSyncs =
      await this.prismaService.pendingDAORegistrySync.findMany({
        take: pendingCodesCount,
        where: {
          isSynced: false,
          ...(creator && { userId: creator.id }),
        },
        include: {
          user: true,
        },
      });

    let resolved = 0;
    let unresolved = 0;

    for (const pendingSync of pendingSyncs) {
      try {
        await this.poapClaimCodeService.assignClaimCodeToUser(
          pendingSync.user,
          pendingSync.daoAddress,
        );
        resolved++;
      } catch (error) {
        console.error(error);
        unresolved++;
      }
    }

    return {
      resolved,
      unresolved,
    };
  }

  async grantAdmin(address: string) {
    const user = await this.userService.findOrCreateUserByAddress(address);

    return this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        isAdmin: true,
      },
    });
  }

  async assignClaimCodeToUser(address: string, daoAddress: string) {
    const user = await this.userService.findOrCreateUserByAddress(address);

    return this.poapClaimCodeService.assignClaimCodeToUser(user, daoAddress);
  }

  async backfillDAORegisteredEvents(
    eventsCount?: number | null,
  ): Promise<BulkActionResult> {
    const events = await this.ethereumService.getDAORegisteredEvents({});

    let resolved = 0;
    let unresolved = 0;

    const daoAddresses = events.map((event) => event.dao);

    const existingClaimCodes = await this.prismaService.poapClaimCode.findMany({
      where: {
        daoAddress: {
          in: daoAddresses,
        },
      },
    });

    const existingPendingSyncs =
      await this.prismaService.pendingDAORegistrySync.findMany({
        where: {
          daoAddress: {
            in: daoAddresses,
          },
        },
      });

    const alreadyProcessed = [
      ...existingClaimCodes.map((claimCode) => ({
        daoAddress: claimCode.daoAddress,
      })),
      ...existingPendingSyncs.map((pendingSync) => ({
        daoAddress: pendingSync.daoAddress,
      })),
    ];

    const filteredEvents = events.filter(
      (event) =>
        !alreadyProcessed.find(
          (processedEvent) => processedEvent.daoAddress === event.dao,
        ),
    );

    const eventsToProcess = eventsCount
      ? filteredEvents.slice(0, eventsCount)
      : filteredEvents;

    for (const event of eventsToProcess) {
      try {
        await this.assignClaimCodeToUser(event.creator, event.dao);
        resolved++;
      } catch (error) {
        console.error(error);
        unresolved++;
      }
    }

    return {
      resolved,
      unresolved,
    };
  }
}
