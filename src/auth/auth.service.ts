import { Injectable } from '@nestjs/common';
import { generateNonce, SiweMessage } from 'siwe';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { SiweSessionInput } from './inputs/siwe-session.input';
import { addHours } from 'date-fns';
import { ConfigService } from '@nestjs/config';
import { addressMatch } from '../common/address-utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  getNonce() {
    return { nonce: generateNonce() };
  }

  async verify(data: SiweSessionInput) {
    const { message, signature } = data;
    try {
      const siweMessage = new SiweMessage(message);
      await siweMessage.validate(signature);

      const expirationDate = addHours(
        new Date(siweMessage.issuedAt),
        this.configService.get<number>('SIWE_SESSION_EXPIRATION_HOURS', 24),
      );

      if (expirationDate < new Date()) {
        return false;
      }

      // Create a new user if the user does not exist
      const user = await this.userService.findOrCreateUserByAddress(
        siweMessage.address,
      );

      if (
        addressMatch(
          user.address,
          this.configService.get<string>('ADMIN_ZERO_ADDRESS', ''),
        ) &&
        !user.isAdmin
      ) {
        await this.userService.grantAdmin(user.address);
      }

      // Find existing session
      const existingSession = await this.prismaService.session.findFirst({
        where: {
          userId: user.id,
        },
      });

      if (existingSession) {
        // Delete any existing session for this user
        await this.prismaService.session.delete({
          where: {
            id: existingSession.id,
          },
        });
      }

      // Create a new session
      await this.prismaService.session.create({
        data: {
          userId: user.id,
          signature,
          expiresAt: expirationDate,
        },
      });

      return true;
    } catch (e) {
      console.error('Error processing SIWE message', e);
      return false;
    }
  }

  async validateSessionBySignature(signature: string) {
    const session = await this.prismaService.session.findFirst({
      where: {
        signature,
      },
      include: {
        user: true,
      },
    });

    if (!session) {
      return null;
    }

    if (session.expiresAt < new Date()) {
      return null;
    }

    return session.user;
  }
}
