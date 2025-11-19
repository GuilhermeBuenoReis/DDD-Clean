import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comments-repository';
import type { QuestionComment } from '@/domain/forum/enterprise/entities/questions-comment';

export class InMemoryQuestionCommentRepository
  implements QuestionCommentRepository
{
  async findById(id: string): Promise<QuestionComment | null> {
    const question = this.items.find(item => item.id.toString() === id);

    if (!question) {
      return null;
    }

    return question;
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams
  ): Promise<QuestionComment[]> {
    const questionComments = this.items
      .filter(item => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return questionComments;
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    const itemIndex = this.items.findIndex(
      item => item.id === questionComment.id
    );

    this.items.splice(itemIndex, 1);
  }
  public items: QuestionComment[] = [];

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment);
  }
}
