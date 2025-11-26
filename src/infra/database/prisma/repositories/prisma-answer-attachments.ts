import { Injectable } from '@nestjs/common';
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';
import { PrismaAnswerAttachmentsMapper } from '../mappers/prisma-answer-attachments-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaAnswerAttachmentRepository
  implements AnswerAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const answersAttachments = await this.prisma.attachment.findMany({
      where: {
        answerId,
      },
    });

    return answersAttachments.map(PrismaAnswerAttachmentsMapper.toDomain);
  }

  async deleteManyByAnswerId(answerId: string) {
    await this.prisma.attachment.findMany({
      where: {
        answerId,
      },
    });
  }
}
