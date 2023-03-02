import { ApolloError } from 'apollo-server-errors';

export class AlreadyMintedError extends ApolloError {
  constructor(message: string | unknown) {
    if (typeof message === 'string') {
      super(message, 'ALREADY_MINTED_ERROR');
    } else if (message instanceof Error) {
      super(message.message, 'ALREADY_MINTED_ERROR');
    } else {
      super('Unknown mint POAP error', 'ALREADY_MINTED_ERROR');
    }
  }
}
