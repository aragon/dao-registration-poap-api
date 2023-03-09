import { Field, InputType } from '@nestjs/graphql';
import { SiweMessage } from './siwe-message.input';

@InputType()
export class SiweSessionInput {
  @Field(() => SiweMessage, { description: 'Message to sign' })
  public message: SiweMessage;

  @Field(() => String, { description: 'SIWE Signature' })
  public signature: string;
}
