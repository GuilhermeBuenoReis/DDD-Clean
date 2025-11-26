import { Injectable } from '@nestjs/common';
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';
import { PrismaQuestionAttachmentsMapper } from '../mappers/prisma-question-attachments-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaQuestionsAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}

  async findManyByQuestionId(
    questionId: string
  ): Promise<QuestionAttachment[]> {
    const questionsAttachments = await this.prisma.attachment.findMany({
      where: {
        questionId,
      },
    });

    return questionsAttachments.map(PrismaQuestionAttachmentsMapper.toDomain);
  }

  async deleteManyByQuestionId(questionId: string) {
    await this.prisma.attachment.findMany({
      where: {
        questionId,
      },
    });
  }
}
