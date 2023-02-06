import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class PoapEventResolver {

  @Query(() => String)
  getHello(): string {
    return process.env.DEPLOYMENT_ENV
  }

}
