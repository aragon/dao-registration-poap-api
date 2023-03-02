import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ErrorLocation, PoapClaimCodeStatus, User } from '@prisma/client';
import { addressMatch } from '../common/address-utils';
import { AlreadyMintedError } from '../errors/already-minted-error';
import { InvalidAddressError } from '../errors/invalid-address-error';
import { PendingDaoRegistrySyncService } from '../pending-dao-registry-sync/pending-dao-registry-sync.service';
import { PoapAuthService } from '../poap-auth/poap-auth.service';
import { PoapEventService } from '../poap-event/poap-event.service';
import { PoapService } from '../poap/poap.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';

@Injectable()
export class PoapClaimCodeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly poapService: PoapService,
    private readonly poapAuthService: PoapAuthService,
    private readonly poapEventService: PoapEventService,
    private readonly pendingDaoRegistrySyncService: PendingDaoRegistrySyncService,
    private readonly userService: UserService,
  ) {}

  async getGroupedActiveClaimCodesCountByStatus() {
    const activeEvents = await this.poapEventService.getActivePoapEvents();

    return this.prismaService.poapClaimCode.groupBy({
      by: ['status'],
      _count: {
        qrHash: true,
      },
      where: {
        eventId: {
          in: activeEvents.map((event) => event.id),
        },
      },
    });
  }

  getAvailableClaimCodesCountByEventIds(eventIds: number[]) {
    return this.prismaService.poapClaimCode.count({
      where: {
        eventId: {
          in: eventIds,
        },
        status: PoapClaimCodeStatus.UNASSIGNED,
      },
    });
  }

  async canClaimPoap(address: string) {
    const user = await this.userService.findOrCreateUserByAddress(address);
    !!(await this.validatedNextClaimCode(user));
  }

  async mintedClaimCode(user: User) {
    return this.prismaService.poapClaimCode.findFirst({
      where: {
        user,
        status: PoapClaimCodeStatus.MINTED,
      },
    });
  }

  async isMinted(qrHash: string) {
    const claimCode = await this.prismaService.poapClaimCode.findUnique({
      where: {
        qrHash,
      },
    });

    if (!claimCode) {
      throw new UnprocessableEntityException('Invalid claim code');
    }

    return claimCode.status === PoapClaimCodeStatus.MINTED;
  }

  async getAssignedCodesForUser(user: User) {
    return this.prismaService.poapClaimCode.findMany({
      where: {
        userId: user.id,
        status: PoapClaimCodeStatus.ASSIGNED,
        daoAddress: {
          not: null,
        },
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async mintClaimCode(user: User) {
    const claimCode = await this.validatedNextClaimCode(user);

    const authToken = await this.poapAuthService.getAuthToken();

    const externalClaimCode = await this.poapService.getClaimQrCode(
      claimCode.qrHash,
      authToken.authToken,
    );

    if (!externalClaimCode) {
      throw new UnprocessableEntityException('Claim code not found');
    }

    if (externalClaimCode.claimed) {
      const status = addressMatch(externalClaimCode.signer, user.address)
        ? 'MINTED'
        : 'ERROR';

      this.prismaService.poapClaimCode.update({
        where: {
          id: claimCode.id,
        },
        data: {
          status,
        },
      });

      if (status === 'ERROR') {
        await this.pendingDaoRegistrySyncService.findOrCreatePendingDaoRegistrySync(
          user,
          claimCode.daoAddress,
          ErrorLocation.CLAIM,
        );

        throw new UnprocessableEntityException('Claim code already claimed');
      } else {
        return this.prismaService.poapClaimCode.findUnique({
          where: {
            id: claimCode.id,
          },
        });
      }
    }

    const mintedClaimCode = await this.poapService.claimQrCode(
      claimCode.qrHash,
      user.address,
      externalClaimCode.secret,
      authToken.authToken,
    );

    if (!mintedClaimCode) {
      throw new UnprocessableEntityException('Error minting claim code');
    }

    await this.prismaService.poapClaimCode.update({
      where: {
        id: claimCode.id,
      },
      data: {
        status: PoapClaimCodeStatus.MINTED,
      },
    });

    return this.prismaService.poapClaimCode.findUnique({
      where: {
        id: claimCode.id,
      },
    });
  }

  async assignClaimCodeToUser(user: User, daoAddress: string) {
    const existingDAOClaimCode =
      await this.prismaService.poapClaimCode.findFirst({
        where: {
          daoAddress,
        },
      });

    if (existingDAOClaimCode) {
      throw new Error('DAO already has a claim code');
    }

    const existingClaimCodes = await this.prismaService.poapClaimCode.findMany({
      where: {
        user,
      },
    });

    // Ignore claim codes that are errored or not assigned
    const pendingClaimCodes = existingClaimCodes.filter(
      (claimCode) =>
        claimCode.status === PoapClaimCodeStatus.ASSIGNED ||
        claimCode.status === PoapClaimCodeStatus.ERROR,
    );

    if (pendingClaimCodes.length > 0) {
      throw new Error('User already has a pending claim code');
    }

    const activeEvents = await this.poapEventService.getActivePoapEvents();

    const activeEventIds = activeEvents.map((event) => event.id);

    const existingClaimCodeEventIds = existingClaimCodes.map(
      (claimCode) => claimCode.eventId,
    );

    // Allow claim codes when the eventId is not the same
    const validEventIds = activeEventIds.filter(
      (eventId) => !existingClaimCodeEventIds.includes(eventId),
    );

    const nextClaimCode = await this.prismaService.poapClaimCode.findFirst({
      where: {
        userId: null,
        status: PoapClaimCodeStatus.UNASSIGNED,
        daoAddress: null,
        eventId: {
          in: validEventIds,
        },
      },
      orderBy: {
        id: 'asc',
      },
    });

    if (!nextClaimCode) {
      await this.pendingDaoRegistrySyncService.findOrCreatePendingDaoRegistrySync(
        user,
        daoAddress,
        ErrorLocation.ASSIGN,
      );

      throw new Error('No more claim codes available for this user');
    }

    const authToken = await this.poapAuthService.getAuthToken();

    const externalClaimCode = await this.poapService.getClaimQrCode(
      nextClaimCode.qrHash,
      authToken.authToken,
    );

    // Edge case where the claim code is already claimed externally
    if (externalClaimCode.claimed) {
      await this.prismaService.poapClaimCode.update({
        where: {
          id: nextClaimCode.id,
        },
        data: {
          status: PoapClaimCodeStatus.ERROR,
        },
      });

      await this.pendingDaoRegistrySyncService.findOrCreatePendingDaoRegistrySync(
        user,
        daoAddress,
        ErrorLocation.ASSIGN,
      );

      throw new Error('Claim code already claimed');
    }

    await this.prismaService.poapClaimCode.update({
      where: {
        id: nextClaimCode.id,
      },
      data: {
        userId: user.id,
        status: PoapClaimCodeStatus.ASSIGNED,
        daoAddress,
      },
    });

    //  If there is a pending sync for this user, remove it
    await this.pendingDaoRegistrySyncService.resolvePendingDaoRegistrySyncs(
      daoAddress,
    );

    return this.prismaService.poapClaimCode.findUnique({
      where: {
        id: nextClaimCode.id,
      },
    });
  }

  private async validatedNextClaimCode(user: User) {
    const allClaimCodesForUser =
      await this.prismaService.poapClaimCode.findMany({
        where: {
          userId: user.id,
        },
        orderBy: {
          id: 'asc',
        },
      });

    const claimCode = allClaimCodesForUser.find(
      (code) =>
        code.status === PoapClaimCodeStatus.ASSIGNED && !code.daoAddress,
    );

    const mintedCode = await this.mintedClaimCode(user);

    if (!claimCode && mintedCode) {
      throw new AlreadyMintedError('Your POAP has already been claimed!');
    }

    if (!claimCode) {
      throw new InvalidAddressError(
        "Make sure you're using the right wallet address. Only wallet addresses whose DAO was made with Aragon can claim POAPs.",
      );
    }

    return claimCode;
  }
}
