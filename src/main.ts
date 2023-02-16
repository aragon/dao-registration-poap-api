import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: _corsOrigin(),
  });
  await app.listen(3000);
}
bootstrap();

function _corsOrigin() {
  // Disable localhost in production
  return [...(process.env.NODE_ENV !== 'production' ? [/localhost:3001/] : [])];
}
