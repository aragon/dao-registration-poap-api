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
import { ReassignPendingSyncResult } from './reassign-pending-sync-result.model';
import { UserService } from '../user/user.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly poapService: PoapService,
    private readonly poapAuthService: PoapAuthService,
    private readonly poapEventService: PoapEventService,
    private readonly poapClaimCodeService: PoapClaimCodeService,
    private readonly userService: UserService,
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
  ): Promise<ReassignPendingSyncResult> {
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

    const promises = pendingSyncs.map((pendingSync) => {
      return this.poapClaimCodeService.assignClaimCodeToUser(
        pendingSync.user,
        pendingSync.daoAddress,
      );
    });

    const results = await Promise.allSettled(promises);

    const failedSyncs = results.filter(
      (result) => result.status === 'rejected',
    );

    return {
      resolved: results.length - failedSyncs.length,
      unresolved: failedSyncs.length,
    };
  }
}
