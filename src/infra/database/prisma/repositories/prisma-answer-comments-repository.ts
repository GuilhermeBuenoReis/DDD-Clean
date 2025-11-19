import { Injectable } from '@nestjs/common';
import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comments-repository';
import type { AnswerComment } from '@/domain/forum/enterprise/entities/answers-comment';

@Injectable()
export class PrismaAnswerCommentRepository implements AnswerCommentRepository {
  findById(id: string): Promise<AnswerComment | null> {
    throw new Error('Method not implemented.');
  }
  findManyByAnswerId(
    id: string,
    params: PaginationParams
  ): Promise<AnswerComment[]> {
    throw new Error('Method not implemented.');
  }
  create(answerComment: AnswerComment): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(answerComment: AnswerComment): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
