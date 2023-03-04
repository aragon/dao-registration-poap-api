import { Args, Query, Resolver } from '@nestjs/graphql';
import { DaoRegistryEvent } from './dao-registry-event.model';
import { DaoRegistryFilterInput } from './dao-registry-filter.input';
import { EthereumService } from './ethereum.service';

@Resolver()
export class EthereumResolver {
  constructor(private readonly ethereumService: EthereumService) {}

  @Query(() => [DaoRegistryEvent], { name: 'DAORegisteredEvents' })
  async daoRegisteredEvents(
    @Args('data', { nullable: true }) data: DaoRegistryFilterInput,
  ) {
    return await this.ethereumService.getDAORegisteredEvents(data ?? {});
  }
}
