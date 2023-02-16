import { InputType } from '@nestjs/graphql';

@InputType()
export class SiweSessionInput {
  public message: string;
  public address: string;
  public nonce: string;
  public signature: string;
}
