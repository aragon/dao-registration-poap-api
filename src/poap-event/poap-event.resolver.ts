import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Int } from '@nestjs/graphql';
import { AuthGuard } from '../auth/auth.guard';
import { ImportPoapEventInput } from './inputs/import-poap-event.input';
import { PoapEvent } from './poap-event.model';
import { PoapEventService } from './poap-event.service';

@Resolver(PoapEvent)
export class PoapEventResolver {
  constructor(private readonly poapEventService: PoapEventService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => PoapEvent)
  async importPoapEvent(
    @Args('data') data: ImportPoapEventInput,
  ): Promise<PoapEvent> {
    return this.poapEventService.importPoapEvent(data);
  }

  @UseGuards(AuthGuard)
  @Query(() => PoapEvent)
  async poapEvent(
    @Args('externalId', { type: () => Int }) externalId: number,
  ): Promise<PoapEvent> {
    return this.poapEventService.getPoapEvent(externalId);
  }

  @UseGuards(AuthGuard)
  @Query(() => [PoapEvent])
  async allPoapEvents(): Promise<PoapEvent[]> {
    return this.poapEventService.getAllPoapEvents();
  }

  @UseGuards(AuthGuard)
  @Query(() => [PoapEvent])
  async activePoapEvents(): Promise<PoapEvent[]> {
    return this.poapEventService.getActivePoapEvents();
  }
}
