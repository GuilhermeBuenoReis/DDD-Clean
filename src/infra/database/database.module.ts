import { Module } from '@nestjs/common';
import { QuestionRepository } from '@/domain/forum/application/repositories/questions-repository';
import { PrismaService } from './prisma/prisma.service';
import { PrismaAnswerAttachmentRepository } from './prisma/repositories/prisma-answer-attachments';
import { PrismaAnswerCommentRepository } from './prisma/repositories/prisma-answer-comments-repository';
import { PrismaAnswerRepository } from './prisma/repositories/prisma-answers-repository';
import { PrismaQuestionsAttachmentsRepository } from './prisma/repositories/prisma-questions-attachments-repository';
import { PrismaQuestionsCommentRepository } from './prisma/repositories/prisma-questions-comment';
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: QuestionRepository,
      useClass: PrismaQuestionsRepository,
    },
    PrismaQuestionsAttachmentsRepository,
    PrismaQuestionsCommentRepository,
    PrismaAnswerAttachmentRepository,
    PrismaAnswerCommentRepository,
    PrismaAnswerRepository,
  ],
  exports: [
    PrismaService,
    PrismaQuestionsAttachmentsRepository,
    PrismaQuestionsCommentRepository,
    QuestionRepository,
    PrismaAnswerAttachmentRepository,
    PrismaAnswerCommentRepository,
    PrismaAnswerRepository,
  ],
})
export class DatabaseModule {}
