import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  const port = process.env.PORT || 3001;

  app.use(helmet());
  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin:
      process.env.NODE_ENV === 'development' ? true : process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Filtre global d'exceptions (log sécurisé, sans données sensibles)
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger — uniquement hors production
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Makiti API')
      .setDescription('API de la marketplace Makiti')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'Authorization',
          in: 'header',
        },
        'JWT',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });

    logger.log(`📚 Swagger disponible sur http://localhost:${port}/api/docs`);
  }

  await app.listen(port);
  logger.log(`🚀 Backend démarré sur http://localhost:${port}/api/v1`);
}

void bootstrap();
