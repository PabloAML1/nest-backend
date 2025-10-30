import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  //Esto activa cors pero con todos los origenes
  //const app = await NestFactory.create(AppModule, { cors: true });

  const app = await NestFactory.create(AppModule);
  //Esto habilita cors para ciertos orígenes
  app.enableCors({
    origin: ['http://localhost:8080', 'http://127.0.0.1:5500'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();