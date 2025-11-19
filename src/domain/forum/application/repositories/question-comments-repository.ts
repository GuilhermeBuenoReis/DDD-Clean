import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { QuestionComment } from '../../enterprise/entities/questions-comment';

export interface QuestionCommentRepository {
  findById(id: string): Promise<QuestionComment | null>;
  findManyByQuestionId(
    id: string,
    params: PaginationParams
  ): Promise<QuestionComment[]>;
  create(questionComment: QuestionComment): Promise<void>;
  delete(questionComment: QuestionComment): Promise<void>;
}
