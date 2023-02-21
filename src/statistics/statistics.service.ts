import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PoapClaimCodeStatus } from '@prisma/client';
import { addDays } from 'date-fns';
import { PendingDaoRegistrySyncService } from '../pending-dao-registry-sync/pending-dao-registry-sync.service';
import { PoapClaimCodeService } from '../poap-claim-code/poap-claim-code.service';
import { PoapEventService } from '../poap-event/poap-event.service';
import { Statistics } from './statistics.model';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly pendingDaoRegistrySyncService: PendingDaoRegistrySyncService,
    private readonly poapClaimCodeService: PoapClaimCodeService,
    private readonly poapEventService: PoapEventService,
    private readonly configService: ConfigService,
  ) {}

  async getStatistics(): Promise<Statistics> {
    const activeEvents = await this.poapEventService.getActivePoapEvents();

    const expiringInLessThanDays = this.configService.get<number>(
      'EXPIRATION_WARNING_DAYS',
      30,
    );

    const groupedActiveClaimCodes =
      await this.poapClaimCodeService.getGroupedActiveClaimCodesCountByStatus();

    const availableClaimCodesCount =
      groupedActiveClaimCodes.find(
        (group) => group.status === PoapClaimCodeStatus.UNASSIGNED,
      )?._count?.qrHash ?? 0;

    const assignedClaimCodesCount =
      groupedActiveClaimCodes.find(
        (group) => group.status === PoapClaimCodeStatus.ASSIGNED,
      )?._count?.qrHash ?? 0;

    const mintedClaimCodesCount =
      groupedActiveClaimCodes.find(
        (group) => group.status === PoapClaimCodeStatus.MINTED,
      )?._count?.qrHash ?? 0;

    const today = new Date();

    const expiringSoonEvents = activeEvents.filter(
      (event) =>
        event.expiresAt > today &&
        event.expiresAt < addDays(today, expiringInLessThanDays),
    );

    const expiringClaimCodesCount =
      (await this.poapClaimCodeService.getAvailableClaimCodesCountByEventIds(
        expiringSoonEvents.map((event) => event.id),
      )) ?? 0;

    const pendingDaoRegistrySyncs =
      await this.pendingDaoRegistrySyncService.getPendingDaoRegistrySyncs();

    const pendingSyncs = pendingDaoRegistrySyncs.map((sync) => ({
      creatorAddress: sync.user.address,
      daoAddress: sync.daoAddress,
      errorLocation: sync.errorLocation,
    }));

    return {
      availableClaimCodesCount,
      assignedClaimCodesCount,
      mintedClaimCodesCount,
      expirationWarning: {
        expiringInLessThanDays,
        claimCodesCount: expiringClaimCodesCount,
      },
      pendingSyncs,
    };
  }
}
