import { makeQuestion } from 'test/factories/make-question';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comments-repository';
import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository';
import { CommentOnQuestionUseCase } from './comment-on-question';

let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: CommentOnQuestionUseCase;

describe('Comment on question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentsRepository
    );
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository();
    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionCommentRepository,
      inMemoryQuestionRepository
    );
  });

  it('should be able to comment on question', async () => {
    const question = makeQuestion();

    inMemoryQuestionRepository.create(question);

    await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: 'comentário teste',
    });

    expect(inMemoryQuestionCommentRepository.items[0].content).toEqual(
      'comentário teste'
    );
  });
});
