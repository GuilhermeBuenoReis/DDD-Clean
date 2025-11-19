import { makeAnswerComment } from 'test/factories/make-answer-comment';
import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comment-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments';

let inMemoryAnswersCommentRepository: InMemoryAnswerCommentRepository;
let sut: FetchAnswerCommentsUseCase;

describe('Fetch answers comment', () => {
  beforeEach(() => {
    inMemoryAnswersCommentRepository = new InMemoryAnswerCommentRepository();
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswersCommentRepository);
  });

  it('should be able to fetch recent answers', async () => {
    await inMemoryAnswersCommentRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityID('answers-id-1') })
    );

    await inMemoryAnswersCommentRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityID('answers-id-1') })
    );

    await inMemoryAnswersCommentRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityID('answers-id-1') })
    );

    const result = await sut.execute({
      answerId: 'answers-id-1',
      page: 1,
    });

    expect(result.value?.answerComments).toHaveLength(3);
  });

  it('should be able to fetch paginated answers comment', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswersCommentRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID('answers-id-1'),
        })
      );
    }

    const result = await sut.execute({
      answerId: 'answers-id-1',
      page: 2,
    });

    expect(result.value?.answerComments).toHaveLength(2);
  });
});
