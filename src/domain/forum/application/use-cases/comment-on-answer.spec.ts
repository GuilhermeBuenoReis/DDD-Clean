import { makeAnswer } from 'test/factories/make-answer';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-comment-repository';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { CommentOnAnswerUseCase } from './comment-on-answer.use-case';

let inMemoryAnswerRepository: InMemoryAnswersRepository;
let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository;
let inMemoryAnswerAttachments: InMemoryAnswerAttachmentsRepository;

let sut: CommentOnAnswerUseCase;

describe('Comment on answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachments = new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswerRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachments
    );
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository();
    sut = new CommentOnAnswerUseCase(
      inMemoryAnswerCommentRepository,
      inMemoryAnswerRepository
    );
  });

  it('should be able to comment on answer', async () => {
    const answer = makeAnswer();

    inMemoryAnswerRepository.create(answer);

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: 'comentário teste',
    });

    expect(inMemoryAnswerCommentRepository.items[0].content).toEqual(
      'comentário teste'
    );
  });
});
