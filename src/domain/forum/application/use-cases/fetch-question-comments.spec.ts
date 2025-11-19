import { makeQuestionComment } from 'test/factories/make-question-comment';
import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comments-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { FetchQuestionCommentsUseCase } from './fetch-question-comments';

let inMemoryQuestionsCommentRepository: InMemoryQuestionCommentRepository;
let sut: FetchQuestionCommentsUseCase;

describe('Fetch questions comment', () => {
  beforeEach(() => {
    inMemoryQuestionsCommentRepository =
      new InMemoryQuestionCommentRepository();
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionsCommentRepository);
  });

  it('shoud be able to fetch recent questions', async () => {
    await inMemoryQuestionsCommentRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityID('questions-id-1') })
    );

    await inMemoryQuestionsCommentRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityID('questions-id-1') })
    );

    await inMemoryQuestionsCommentRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityID('questions-id-1') })
    );

    const result = await sut.execute({
      questionId: 'questions-id-1',
      page: 1,
    });

    expect(result.value?.questionComments).toHaveLength(3);
  });

  it('shoud be able to fetch paginated questions comment', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionsCommentRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID('questions-id-1'),
        })
      );
    }

    const result = await sut.execute({
      questionId: 'questions-id-1',
      page: 2,
    });

    expect(result.value?.questionComments).toHaveLength(2);
  });
});
