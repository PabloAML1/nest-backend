import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  //Esto activa cors pero con todos los origenes
  //const app = await NestFactory.create(AppModule, { cors: true });

  const app = await NestFactory.create(AppModule);

  // Configurar CORS para desarrollo y producción
  const allowedOrigins = [
    'http://localhost:8080',
    'http://127.0.0.1:5500',
    // Agrega tu URL de Railway cuando la tengas
    // 'https://tu-app.up.railway.app'
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Permitir requests sin origin (como mobile apps o curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();