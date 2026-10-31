import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      const raw = process.env.CORS_ORIGIN;
      if (!raw || raw === '*' || raw.trim() === '') {
        return callback(null, true);
      }

      const allowed = raw
        .split(',')
        .map((item) => item.trim().replace(/\/$/, '').toLowerCase());

      const normalizedOrigin = origin.replace(/\/$/, '').toLowerCase();
      if (allowed.includes('*') || allowed.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  const port = Number(process.env.PORT || 3001);
  await app.listen(port, '0.0.0.0');
}
bootstrap();
