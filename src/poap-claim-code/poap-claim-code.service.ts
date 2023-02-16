import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PoapClaimCodeStatus, User } from '@prisma/client';
import { PoapAuthService } from '../poap-auth/poap-auth.service';
import { PoapEventService } from '../poap-event/poap-event.service';
import { PoapService } from '../poap/poap.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';

@Injectable()
export class PoapClaimCodeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly poapService: PoapService,
    private readonly poapAuthService: PoapAuthService,
    private readonly poapEventService: PoapEventService,
  ) {}

  async getClaimCodeStatistics() {
    const totalClaimCodes = await this.prismaService.poapClaimCode.count();

    const totalClaimCodesAssigned =
      await this.prismaService.poapClaimCode.count({
        where: {
          status: PoapClaimCodeStatus.ASSIGNED,
        },
      });

    const totalClaimCodesMinted = await this.prismaService.poapClaimCode.count({
      where: {
        status: PoapClaimCodeStatus.MINTED,
      },
    });

    return {
      totalClaimCodes,
      totalClaimCodesAssigned,
      totalClaimCodesMinted,
    };
  }

  async canClaimPoap(user: User) {
    return this.getAvailableClaimCodesForUser(user.address).then(
      (claimCodes) => claimCodes.length > 0,
    );
  }

  async mintedClaimCode(userAddress: string) {
    const user = await this.userService.findOrCreateUserByAddress(userAddress);

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

    if (claimCode.status === PoapClaimCodeStatus.MINTED) {
      return true;
    }

    const authToken = await this.poapAuthService.getAuthToken();

    const externalClaimCode = await this.poapService.getClaimQrCode(
      qrHash,
      authToken.authToken,
    );

    if (!externalClaimCode) {
      throw new UnprocessableEntityException('Claim code not found');
    }

    return externalClaimCode.claimed;
  }

  async getAvailableClaimCodesForUser(address: string) {
    const user = await this.userService.findOrCreateUserByAddress(address);

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

  async mintClaimCode(address: string) {
    const [claimCode] = await this.getAvailableClaimCodesForUser(address);

    if (!claimCode) {
      throw new UnprocessableEntityException(
        'No claim codes available for this user',
      );
    }

    const authToken = await this.poapAuthService.getAuthToken();

    const externalClaimCode = await this.poapService.getClaimQrCode(
      claimCode.qrHash,
      authToken.authToken,
    );

    if (!externalClaimCode) {
      throw new UnprocessableEntityException('Claim code not found');
    }

    if (externalClaimCode.claimed) {
      throw new UnprocessableEntityException('Claim code already claimed');
    }

    const mintedClaimCode = await this.poapService.claimQrCode(
      claimCode.qrHash,
      address,
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

  async assignClaimCodeToUser(creatorAddress: string, daoAddress: string) {
    const existingDAOClaimCode =
      await this.prismaService.poapClaimCode.findFirst({
        where: {
          daoAddress,
        },
      });

    if (existingDAOClaimCode) {
      throw new Error('DAO already has a claim code');
    }

    const user = await this.userService.findOrCreateUserByAddress(
      creatorAddress,
    );

    const existingClaimCodes = await this.prismaService.poapClaimCode.findMany({
      where: {
        user,
      },
    });

    const assignedClaimCodes = existingClaimCodes.filter(
      (claimCode) => claimCode.status === PoapClaimCodeStatus.ASSIGNED,
    );

    if (assignedClaimCodes.length > 0) {
      throw new Error('User already has an assigned claim code');
    }

    const activeEvents = await this.poapEventService.getActivePoapEvents();

    const activeEventIds = activeEvents.map((event) => event.id);

    // Allow claim codes when the eventId is not the same
    const existingClaimCodeEventIds = existingClaimCodes.map(
      (claimCode) => claimCode.eventId,
    );

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
      console.error('No more claim codes available for this user');

      // Create PendingDAORegistrySync
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
  }
}
