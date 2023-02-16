import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
