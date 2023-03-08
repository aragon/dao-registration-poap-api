import { Args, Mutation, Query, Resolver, Int } from '@nestjs/graphql';
import { Auth } from '../auth/auth.decorator';
import { PoapClaimCode } from '../poap-claim-code/poap-claim-code.model';
import { PoapEvent } from '../poap-event/poap-event.model';
import { PoapEventService } from '../poap-event/poap-event.service';
import { AdminService } from './admin.service';
import { ImportPoapEventInput } from './inputs/import-poap-event.input';
import { BulkActionResult } from './bulk-action-result.model';

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
  @Mutation(() => BulkActionResult)
  async reassignPendingClaimCodes(
    @Args('count', { type: () => Int }) pendingCodesCount: number,
    @Args('creatorAddress', { type: () => String, nullable: true })
    creatorAddress: string,
  ): Promise<BulkActionResult> {
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
  async grantAdmin(
    @Args('address', { type: () => String }) address: string,
  ): Promise<boolean> {
    return !!(await this.adminService.grantAdmin(address));
  }

  @Auth({ isAdmin: true })
  @Mutation(() => PoapClaimCode)
  async assignClaimCode(
    @Args('address', { type: () => String }) address: string,
    @Args('daoAddres', { type: () => String, nullable: false })
    daoAddres: string,
  ) {
    return this.adminService.assignClaimCodeToUser(address, daoAddres);
  }

  @Auth({ isAdmin: true })
  @Mutation(() => BulkActionResult)
  async backfillDAORegisteredEvents(
    @Args('count', { type: () => Int, nullable: true }) eventsCount: number,
  ): Promise<BulkActionResult> {
    return this.adminService.backfillDAORegisteredEvents(eventsCount);
  }

  @Auth({ isAdmin: true })
  @Mutation(() => [PoapClaimCode])
  async assignedCodes(): Promise<PoapClaimCode[]> {
    return this.adminService.assignedClaimCodes();
  }

  @Auth({ isAdmin: true })
  @Mutation(() => Boolean)
  async deleteEvent(
    @Args('externalId', { type: () => Int }) externalId: number,
  ): Promise<boolean> {
    return this.adminService.deleteEvent(externalId);
  }
}
