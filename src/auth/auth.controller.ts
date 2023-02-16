import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SiweSessionInput } from './inputs/SiweSession.input';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('nonce')
  getNonce() {
    return this.authService.getNonce();
  }

  @Post('verify')
  async verify(@Body() data: SiweSessionInput) {
    const validMessage = await this.authService.verify(data);
    return { success: validMessage };
  }
}
