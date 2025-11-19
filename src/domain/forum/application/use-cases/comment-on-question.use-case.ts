import { type Either, left, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found';
import { QuestionComment } from '../../enterprise/entities/questions-comment';
import type { QuestionCommentRepository } from '../repositories/question-comments-repository';
import type { QuestionRepository } from '../repositories/questions-repository';

interface CommentOnQuestionUseCaseRequest {
  authorId: string;
  questionId: string;
  content: string;
}

type CommentOnQuestionUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    questionComment: QuestionComment;
  }
>;

export class CommentOnQuestionUseCase {
  constructor(
    private questionCommentRepository: QuestionCommentRepository,
    private questionRepository: QuestionRepository
  ) {}

  async execute({
    questionId,
    authorId,
    content,
  }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
      content,
    });

    await this.questionCommentRepository.create(questionComment);

    return right({
      questionComment,
    });
  }
}
