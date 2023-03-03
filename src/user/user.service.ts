import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { utils } from 'ethers';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserByAddress(address: string) {
    return this.prismaService.user.findUnique({
      where: {
        address,
      },
    });
  }

  async findOrCreateUserByAddress(address: string) {
    if (!utils.isAddress(address)) {
      throw new BadRequestException('Invalid address');
    }

    return this.prismaService.user.upsert({
      where: {
        address,
      },
      create: {
        address,
      },
      update: {},
    });
  }

  async grantAdmin(address: string) {
    if (!utils.isAddress(address)) {
      throw new BadRequestException('Invalid address');
    }

    return this.prismaService.user.update({
      where: {
        address,
      },
      data: {
        isAdmin: true,
      },
    });
  }
}
