import { makeAnswer } from 'test/factories/make-answer';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { FetchQuestionAnswersUseCase } from './fetch-question-answers.use-case';

let inAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: FetchQuestionAnswersUseCase;

describe('Fetch questions answers', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository
    );
    sut = new FetchQuestionAnswersUseCase(inAnswersRepository);
  });

  it('shoud be able to fetch recent questions', async () => {
    await inAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityID('questions-id-1') })
    );

    await inAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityID('questions-id-1') })
    );

    await inAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityID('questions-id-1') })
    );

    const result = await sut.execute({
      questionId: 'questions-id-1',
      page: 1,
    });

    expect(result.value?.answers).toHaveLength(3);
  });

  it('shoud be able to fetch paginated questions answers', async () => {
    for (let i = 1; i <= 22; i++) {
      await inAnswersRepository.create(
        makeAnswer({ questionId: new UniqueEntityID('questions-id-1') })
      );
    }

    const result = await sut.execute({
      questionId: 'questions-id-1',
      page: 2,
    });

    expect(result.value?.answers).toHaveLength(2);
  });
});
