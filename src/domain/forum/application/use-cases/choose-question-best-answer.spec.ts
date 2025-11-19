import { makeAnswer } from 'test/factories/make-answer';
import { makeQuestion } from 'test/factories/make-question';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer.use-case';

let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryAnswerRepository: InMemoryAnswersRepository;
let inMemoryQuestionAttachments: InMemoryQuestionAttachmentsRepository;
let inMemoryAnswerAttachments: InMemoryAnswerAttachmentsRepository;
let sut: ChooseQuestionBestAnswerUseCase;

describe('Choose question best answer', () => {
  beforeEach(() => {
    inMemoryQuestionAttachments = new InMemoryQuestionAttachmentsRepository();
    inMemoryAnswerAttachments = new InMemoryAnswerAttachmentsRepository();
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachments
    );
    inMemoryAnswerRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachments
    );
    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionRepository,
      inMemoryAnswerRepository
    );
  });

  it('shoud be able to choose the question best answer', async () => {
    const question = makeQuestion();
    const answer = makeAnswer({
      questionId: question.id,
    });

    inMemoryQuestionRepository.create(question);
    inMemoryAnswerRepository.create(answer);

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString(),
    });

    expect(inMemoryQuestionRepository.items[0].bestAnswerId).toEqual(answer.id);
  });

  it('shoud not be able to choose another user question best answer', async () => {
    const question = makeQuestion({
      authorId: new UniqueEntityID('author-1'),
    });

    const answer = makeAnswer({
      questionId: question.id,
    });

    inMemoryQuestionRepository.create(question);
    inMemoryAnswerRepository.create(answer);

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: 'author-2',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
