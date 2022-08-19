import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AUTH_HEADER } from './modules/auth/constants/strategy.constant';
import responseTime from 'response-time';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.enableCors();
  app.use(
    responseTime({
      header: 'x-response-time',
    }),
  );
  app.setGlobalPrefix(
    `${configService.get<string>('app.serviceName')}/${configService.get(
      'app.version',
    )}`,
  );

  /** Swagger configuration*/
  const options = new DocumentBuilder()
    .setTitle(configService.get<string>('app.name'))
    .setDescription(configService.get<string>('app.description'))
    .setVersion(configService.get<string>('app.version'))
    .addBearerAuth()
    .addBasicAuth()
    .addApiKey(
      {
        name: AUTH_HEADER.API_KEY,
        in: 'header',
        type: 'apiKey',
      },
      AUTH_HEADER.API_KEY,
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  const port = configService.get<number>('port');
  await app.listen(port);
}
bootstrap();
