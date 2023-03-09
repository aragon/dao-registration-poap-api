import { Controller, Get } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('/')
  async statistics() {
    try {
      const result = await this.statisticsService.getStatistics();
      return result;
    } catch (error) {
      console.log(error);
      return { error: error.message };
    }
  }
}
