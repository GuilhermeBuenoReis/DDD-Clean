import { makeAnswer } from 'test/factories/make-answer';
import { makeAnswerComment } from 'test/factories/make-answer-comment';
import { makeQuestion } from 'test/factories/make-question';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comment-repository';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notification-repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository';
import { waitFor } from 'test/utils/wait-for';
import { type MockInstance, vi } from 'vitest';
import {
  SendNotificationUseCase,
  type SendNotificationUseCaseRequest,
  type SendNotificationUseCaseResponse,
} from '../use-cases/send-notification';
import { OnAnswerCommentCreated } from './on-answer-comment-created';

let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryNotificationRepository: InMemoryNotificationRepository;
let inMemoryAnswersCommentRepository: InMemoryAnswerCommentRepository;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNotificationExecuteSpy: MockInstance<
  (
    payload: SendNotificationUseCaseRequest
  ) => Promise<SendNotificationUseCaseResponse>
>;

describe('On Answer Comment', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentsRepository
    );
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository
    );
    inMemoryNotificationRepository = new InMemoryNotificationRepository();

    inMemoryAnswersCommentRepository = new InMemoryAnswerCommentRepository();

    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationRepository
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute');

    new OnAnswerCommentCreated(
      inMemoryAnswersRepository,
      sendNotificationUseCase
    );
  });

  it('should send a notification when a new comment answer is created', async () => {
    const question = makeQuestion();
    const answer = makeAnswer({ questionId: question.id });
    const answerComment = makeAnswerComment({ answerId: answer.id });

    await inMemoryQuestionRepository.create(question);
    await inMemoryAnswersRepository.create(answer);
    await inMemoryAnswersCommentRepository.create(answerComment);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
