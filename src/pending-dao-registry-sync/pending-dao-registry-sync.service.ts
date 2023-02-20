import { Injectable } from '@nestjs/common';
import { ErrorLocation, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PendingDaoRegistrySyncService {
  constructor(private readonly prismaService: PrismaService) {}

  async getPendingDaoRegistrySyncs() {
    return this.prismaService.pendingDAORegistrySync.findMany({
      where: {
        isSynced: false,
      },
      include: {
        user: true,
      },
    });
  }

  async findOrCreatePendingDaoRegistrySync(
    user: User,
    daoAddress: string,
    errorLocation: ErrorLocation,
  ) {
    const existingPendingSync =
      await this.prismaService.pendingDAORegistrySync.findFirst({
        where: {
          isSynced: false,
          userId: user.id,
          daoAddress,
        },
      });

    if (existingPendingSync) {
      return existingPendingSync;
    }

    return this.prismaService.pendingDAORegistrySync.create({
      data: {
        userId: user.id,
        daoAddress,
        errorLocation,
      },
    });
  }
}
