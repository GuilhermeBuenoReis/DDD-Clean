import { DomainEvents } from '@/core/events/domain-events';
import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comments-repository';
import type { AnswerComment } from '@/domain/forum/enterprise/entities/answers-comment';

export class InMemoryAnswerCommentRepository
  implements AnswerCommentRepository
{
  public items: AnswerComment[] = [];

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment);
    DomainEvents.dispatchEventsForAggregate(answerComment.id);
  }

  async findById(id: string): Promise<AnswerComment | null> {
    const answer = this.items.find(item => item.id.toString() === id);

    if (!answer) {
      return null;
    }

    return answer;
  }

  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams
  ): Promise<AnswerComment[]> {
    const answers = this.items
      .filter(item => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20);

    return answers;
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    const itemIndex = this.items.findIndex(
      item => item.id === answerComment.id
    );

    this.items.splice(itemIndex, 1);
  }
}
