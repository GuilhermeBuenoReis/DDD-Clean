import { Module } from '@nestjs/common';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question.use-case';
import { DatabaseModule } from '../database/database.module';
import { AuthenticateController } from './controller/authenticate.controller';
import { CreateAccountController } from './controller/create-account.controller';
import { CreateQuestionController } from './controller/create-questions.controller';
import { FetchRecentQuestionController } from './controller/fetch-recent-question.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionController,
  ],
  providers: [CreateQuestionUseCase],
})
export class HttpModule {}
