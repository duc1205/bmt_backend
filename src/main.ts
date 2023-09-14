import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app-module';
import { AllExceptionsFilter } from './exceptions/all-exceptions-filter';
import { ValidationError, useContainer } from 'class-validator';
import { LogicalException } from './exceptions/logical-exception';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { parseBoolean, readJsonFile } from './core/helpers/utils';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { initializeTransactionalContext } from 'typeorm-transactional';

async function bootstrap() {
  setupTypeOrmTransactional();

  const app = await NestFactory.create(AppModule, {
    cors: {
      exposedHeaders: ['X-Total-Count', 'X-Error-Code', 'X-Error-Message'],
    },
  });
  app.enableVersioning();

  app.useGlobalPipes(validationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());

  initValidation(app);
  await initSwagger(app);

  await app.listen(app.get(ConfigService).get<number>('app.port') ?? 80);
}

async function initSwagger(app: INestApplication) {
  const configService = app.get(ConfigService);

  if (parseBoolean(configService.get<boolean>('swagger.enabled'))) {
    const packageApp = await readJsonFile('package.json');

    const swaggerConfig = new DocumentBuilder()
      .setTitle(`${configService.get<string>('swagger.title')}`)
      .setDescription(`${configService.get<string>('swagger.description')}`)
      .setVersion(packageApp.version)
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup(`${configService.get<string>('swagger.path')}`, app, document);
  }
}

function initValidation(app: INestApplication) {
  //To custom new validator.
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
}

function validationPipe(): ValidationPipe {
  return new ValidationPipe({
    transform: true,
    exceptionFactory: (errors: ValidationError[]) => {
      throw LogicalException.fromValidationErrors(errors);
    },
  });
}

function setupTypeOrmTransactional() {
  initializeTransactionalContext();
}
bootstrap();
