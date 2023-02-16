import { Injectable } from '@nestjs/common';
import { generateNonce, SiweMessage } from 'siwe';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { SiweSessionInput } from './inputs/SiweSession.input';
import { addHours } from 'date-fns';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
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
        parseInt(process.env.SESSION_DURATION_HOURS),
      );

      if (expirationDate < new Date()) {
        return false;
      }

      // Create a new user if the user does not exist
      const user = await this.userService.findOrCreateUserByAddress(
        siweMessage.address,
      );

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
