import { configure as serverlessExpress } from '@vendia/serverless-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

let cachedServer;

export const handler = async (event, context) => {
  if (!cachedServer) {
    const nestApp = await NestFactory.create(AppModule);
    await nestApp.init();
    cachedServer = serverlessExpress({
      app: nestApp.getHttpAdapter().getInstance(),
    });
  }

  return cachedServer(event, context);
};
/* import { configure as serverlessExpress } from '@vendia/serverless-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FallbackExceptionFilter } from './filters/fallback.filter';
import { HttpExceptionFilter } from './filters/http.filter';
import { ValidationException } from './filters/validation.exception';
import { ValidationFilter } from './filters/validation.filter';
import helmet from 'helmet';
import { ValidationError, ValidationPipe } from '@nestjs/common';

let cachedServer;

export const handler = async (event, context) => {
  if (!cachedServer) {
    const nestApp = await NestFactory.create(AppModule);
    nestApp.setGlobalPrefix('api');

    nestApp.enableCors();

    nestApp.use(helmet());

    nestApp.useGlobalFilters(
      new FallbackExceptionFilter(),
      new HttpExceptionFilter(),
      new ValidationFilter(),
    );
    nestApp.useGlobalPipes(
      new ValidationPipe({
        skipMissingProperties: true,
        exceptionFactory: (errors: ValidationError[]) => {
          const messages = errors.map(
            (error) => `${error.property} has wrong value ${error.value},
                  ${Object.values(error.constraints).join(', ')} `,
          );

          return new ValidationException(messages);
        },
      }),
    );

    await nestApp.init();
    cachedServer = serverlessExpress({
      app: nestApp.getHttpAdapter().getInstance(),
    });
  }

  return cachedServer(event, context);
};
 */
