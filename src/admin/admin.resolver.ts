import { Args, Mutation, Query, Resolver, Int } from '@nestjs/graphql';
import { Auth } from '../auth/auth.decorator';
import { PoapEvent } from '../poap-event/poap-event.model';
import { PoapEventService } from '../poap-event/poap-event.service';
import { AdminService } from './admin.service';
import { ImportPoapEventInput } from './inputs/import-poap-event.input';
import { ReassignPendingSyncResult } from './reassign-pending-sync-result.model';

@Resolver('Admin')
export class AdminResolver {
  constructor(
    private readonly adminService: AdminService,
    private readonly poapEventService: PoapEventService,
  ) {}

  @Auth({ isAdmin: true })
  @Mutation(() => PoapEvent)
  async importPoapEvent(
    @Args('data') data: ImportPoapEventInput,
  ): Promise<PoapEvent> {
    return this.adminService.importPoapEvent(data);
  }

  @Auth({ isAdmin: true })
  @Mutation(() => ReassignPendingSyncResult)
  async reassignPendingClaimCodes(
    @Args('count', { type: () => Int }) pendingCodesCount: number,
    @Args('creatorAddress', { type: () => String, nullable: true })
    creatorAddress: string,
  ): Promise<ReassignPendingSyncResult> {
    return this.adminService.reassingPendingSyncAttempts(
      pendingCodesCount,
      creatorAddress,
    );
  }

  @Auth({ isAdmin: true })
  @Query(() => PoapEvent)
  async poapEvent(
    @Args('externalId', { type: () => Int }) externalId: number,
  ): Promise<PoapEvent> {
    return this.poapEventService.getPoapEvent(externalId);
  }

  @Auth({ isAdmin: true })
  @Query(() => [PoapEvent], { name: 'allPoapEvents' })
  async allPoapEvents(): Promise<PoapEvent[]> {
    return this.poapEventService.getAllPoapEvents();
  }

  @Auth({ isAdmin: true })
  @Query(() => [PoapEvent])
  async activePoapEvents(): Promise<PoapEvent[]> {
    return this.poapEventService.getActivePoapEvents();
  }

  @Auth({ isAdmin: true })
  @Mutation(() => Boolean)
  async grantAdminRole(
    @Args('address', { type: () => String }) address: string,
  ): Promise<boolean> {
    return !!(await this.adminService.grantAdmin(address));
  }
}
