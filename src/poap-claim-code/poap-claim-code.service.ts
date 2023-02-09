import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PoapAuthService } from '../poap-auth/poap-auth.service';
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
  ) {}

  async getClaimCodeStatistics() {
    const totalClaimCodes = await this.prismaService.poapClaimCode.count();

    const totalClaimCodesAssigned =
      await this.prismaService.poapClaimCode.count({
        where: {
          isAssigned: true,
        },
      });

    const totalClaimCodesMinted = await this.prismaService.poapClaimCode.count({
      where: {
        isMinted: true,
      },
    });

    return {
      totalClaimCodes,
      totalClaimCodesAssigned,
      totalClaimCodesMinted,
    };
  }

  async canClaimPoap(userAddress: string) {
    return this.getAvailableClaimCodesForUser(userAddress).then(
      (claimCodes) => claimCodes.length > 0,
    );
  }

  async mintedClaimCode(userAddress: string) {
    const user = await this.userService.findUserByAddressOrCreate(userAddress);

    return this.prismaService.poapClaimCode.findFirst({
      where: {
        user,
        isMinted: true,
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

    if (claimCode.isMinted) {
      return true;
    } else {
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
    const user = await this.userService.findUserByAddressOrCreate(address);

    return this.prismaService.poapClaimCode.findMany({
      where: {
        userId: user.id,
        isAssigned: true,
        isMinted: false,
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
        isAssigned: true,
        isMinted: true,
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

    const user = await this.userService.findUserByAddressOrCreate(
      creatorAddress,
    );

    const existingClaimCodes = await this.prismaService.poapClaimCode.findMany({
      where: {
        user,
      },
    });

    const unclaimedCodes = existingClaimCodes.filter(
      (claimCode) => !claimCode.isAssigned,
    );

    if (unclaimedCodes.length > 0) {
      throw new Error('User already has an available claim code');
    }

    const nextClaimCode = await this.prismaService.poapClaimCode.findFirst({
      where: {
        userId: null,
        isAssigned: false,
        daoAddress: null,
        eventId: {
          not: {
            in: existingClaimCodes.map((claimCode) => claimCode.eventId),
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });

    if (!nextClaimCode) {
      throw new Error('No more claim codes available for this user');
    }

    await this.prismaService.poapClaimCode.update({
      where: {
        id: nextClaimCode.id,
      },
      data: {
        userId: user.id,
        daoAddress,
      },
    });
  }
}
