import { DomainEvents } from '@/core/events/domain-events';
import type { EventHandler } from '@/core/events/event-handler';
import type { AnswersRepository } from '@/domain/forum/application/repositories/answer-repository';
import { AnswerCommentCreatedEvent } from '@/domain/forum/enterprise/events/answer-comments-created-event';
import type { SendNotificationUseCase } from '../use-cases/send-notification.use-case';

export class OnAnswerCommentCreated implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      AnswerCommentCreatedEvent.name
    );
  }

  private async sendNewAnswerNotification({
    answerComment,
  }: AnswerCommentCreatedEvent) {
    const answer = await this.answersRepository.findById(
      answerComment.answerId.toString()
    );

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: `Novo comentário na sua resposta!`,
        content: answerComment.content.substring(0, 40).concat('...'),
      });
    }
  }
}
