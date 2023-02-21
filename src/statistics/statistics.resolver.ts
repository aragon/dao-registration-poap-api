import { Query, Resolver } from '@nestjs/graphql';
import { Statistics } from './statistics.model';
import { StatisticsService } from './statistics.service';

@Resolver()
export class StatisticsResolver {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Query(() => Statistics, { name: 'statistics' })
  async statistics() {
    return this.statisticsService.getStatistics();
  }
}
