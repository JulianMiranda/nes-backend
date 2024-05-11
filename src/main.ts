import { NestFactory } from '@nestjs/core';
import { ValidationError, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { PORT } from './config/config';
import { FallbackExceptionFilter } from './filters/fallback.filter';
import { HttpExceptionFilter } from './filters/http.filter';
import { ValidationException } from './filters/validation.exception';
import { ValidationFilter } from './filters/validation.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.enableCors();

  app.use(helmet());

  /* app.use(csurf()); */

  /* app.use(
		rateLimit({
			windowMs: 15 * 60 * 1000, // 15 minutes
			max: 100, // limit each IP to 100 requests per windowMs
		}),
	); */

  app.useGlobalFilters(
    new FallbackExceptionFilter(),
    new HttpExceptionFilter(),
    new ValidationFilter(),
  );
  app.useGlobalPipes(
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
  await app.listen(PORT);
}
bootstrap();
