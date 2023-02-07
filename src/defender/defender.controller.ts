import { Body, Controller, Post } from '@nestjs/common';
import { DefenderService } from './defender.service';

@Controller('defender')
export class DefenderController {
  constructor(private readonly defenderService: DefenderService) {}

  @Post('dao-registration')
  async daoRegistration(@Body() body: DefenderWebhookBody) {
    return this.defenderService.handleDAORegistration(body);
  }
}
