import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';

@Injectable()
export class PoapClaimCodeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  async getClaimCodesForUser(address: string) {
    const user = await this.userService.findUserByAddressOrCreate(address);

    return this.prismaService.pOAPClaimCode.findMany({
      where: {
        userId: user.id,
        minted: false,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async assignClaimCodeToUser(creatorAddress: string, daoAddress: string) {
    const user = await this.userService.findUserByAddressOrCreate(
      creatorAddress,
    );

    const existingDAOClaimCode =
      await this.prismaService.pOAPClaimCode.findFirst({
        where: {
          daoAddress,
        },
      });

    if (existingDAOClaimCode) {
      throw new Error('Cannot claim twice for the same DAO');
    }

    const nextClaimCode = await this.prismaService.pOAPClaimCode.findFirst({
      where: {
        userId: null,
        minted: false,
        daoAddress: null,
      },
      orderBy: {
        id: 'asc',
      },
    });

    if (!nextClaimCode) {
      throw new Error('No more claim codes available');
    }

    await this.prismaService.pOAPClaimCode.update({
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
