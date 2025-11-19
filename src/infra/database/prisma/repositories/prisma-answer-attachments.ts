import { Injectable } from '@nestjs/common';
import type { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments';
import type { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';

@Injectable()
export class PrismaAnswerAttachmentRepository
  implements AnswerAttachmentsRepository
{
  findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    throw new Error('Method not implemented.');
  }
  deleteManyByAnswerId(answerId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
