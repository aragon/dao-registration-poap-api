import { Args, Mutation, Query, Resolver, Int } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { Auth } from '../auth/auth.decorator';
import { AuthenticatedUser } from '../user/authenticated-user.decorator';
import { ImportPoapEventInput } from './inputs/import-poap-event.input';
import { PoapEvent } from './poap-event.model';
import { PoapEventService } from './poap-event.service';

@Resolver(PoapEvent)
export class PoapEventResolver {
  constructor(private readonly poapEventService: PoapEventService) {}

  @Auth('admin')
  @Mutation(() => PoapEvent)
  async importPoapEvent(
    @AuthenticatedUser() authUser: User,
    @Args('data') data: ImportPoapEventInput,
  ): Promise<PoapEvent> {
    return this.poapEventService.importPoapEvent(data);
  }

  @Auth('admin')
  @Query(() => PoapEvent)
  async poapEvent(
    @Args('externalId', { type: () => Int }) externalId: number,
  ): Promise<PoapEvent> {
    return this.poapEventService.getPoapEvent(externalId);
  }

  @Auth('admin')
  @Query(() => [PoapEvent], { name: 'allPoapEvents' })
  async allPoapEvents(): Promise<PoapEvent[]> {
    return this.poapEventService.getAllPoapEvents();
  }

  @Auth('admin')
  @Query(() => [PoapEvent])
  async activePoapEvents(): Promise<PoapEvent[]> {
    return this.poapEventService.getActivePoapEvents();
  }
}
