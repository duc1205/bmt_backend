import { CommandFactory } from 'nest-commander';
import { ErrorException } from './exceptions/error-exception';
import { AppModule } from './modules/app/app-module';

async function bootstrap() {
  await CommandFactory.run(AppModule, {
    errorHandler: (err) => {
      process.exit(handleError(err));
    },
    serviceErrorHandler: (err) => {
      process.exit(handleError(err));
    },
  });
}

function handleError(err: Error): number {
  if (err instanceof ErrorException) {
    console.error(err.message, err.description);
    return err.code;
  } else {
    console.error(err.message);
    return -1;
  }
}

bootstrap();
