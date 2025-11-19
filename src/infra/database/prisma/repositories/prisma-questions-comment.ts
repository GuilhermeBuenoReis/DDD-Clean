import { Injectable } from '@nestjs/common';
import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comments-repository';
import type { QuestionComment } from '@/domain/forum/enterprise/entities/questions-comment';

@Injectable()
export class PrismaQuestionsCommentRepository
  implements QuestionCommentRepository
{
  findById(id: string): Promise<QuestionComment | null> {
    throw new Error('Method not implemented.');
  }
  findManyByQuestionId(
    id: string,
    params: PaginationParams
  ): Promise<QuestionComment[]> {
    throw new Error('Method not implemented.');
  }
  create(questionComment: QuestionComment): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(questionComment: QuestionComment): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
