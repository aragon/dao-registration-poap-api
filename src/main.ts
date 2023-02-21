import { NestFactory } from '@nestjs/core';
import { AppModule, corsOrigin } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: corsOrigin(),
  });
  await app.listen(3000);
}
bootstrap();
