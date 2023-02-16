import { Injectable } from '@nestjs/common';
import { generateNonce, SiweMessage } from 'siwe';
import { SiweSessionInput } from './inputs/SiweSession.input';

@Injectable()
export class AuthService {
  getNonce() {
    return { nonce: generateNonce() };
  }

  async verify(data: SiweSessionInput) {
    const { message, signature } = data;
    try {
      const siweMessage = new SiweMessage(message);
      await siweMessage.validate(signature);
      return true;
    } catch (e) {
      return false;
    }
  }
}
