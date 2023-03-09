import { ApolloError } from 'apollo-server-errors';

export class InvalidAddressError extends ApolloError {
  constructor(message: string | unknown) {
    if (typeof message === 'string') {
      super(message, 'INVALID_ADDRESS_ERROR');
    } else if (message instanceof Error) {
      super(message.message, 'INVALID_ADDRESS_ERROR');
    } else {
      super('Unknown mint POAP error', 'INVALID_ADDRESS_ERROR');
    }
  }
}
