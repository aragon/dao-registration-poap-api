import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ImportPoapEventInput } from './inputs/import-poap-event.input';
import { PoapEvent } from './poap-event.model';
import { PoapEventService } from './poap-event.service';

@Resolver(PoapEvent)
export class PoapEventResolver {
  constructor(private readonly poapEventService: PoapEventService) {}

  @Mutation(() => PoapEvent)
  async importPoapEvent(
    @Args('data') data: ImportPoapEventInput,
  ): Promise<PoapEvent> {
    return this.poapEventService.importPoapEvent(data);
  }

  @Query(() => PoapEvent)
  async poapEvent(@Args('externalId') externalId: number): Promise<PoapEvent> {
    return this.poapEventService.getPOAPEvent(externalId);
  }
}
