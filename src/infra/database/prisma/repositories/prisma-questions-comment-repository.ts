import { Injectable } from '@nestjs/common';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comments-repository';
import { QuestionComment } from '@/domain/forum/enterprise/entities/questions-comment';
import { PrismaQuestionCommentMapper } from '../mappers/prisma-question-comment-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaQuestionsCommentRepository
  implements QuestionCommentRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<QuestionComment | null> {
    const questionComment = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    });

    if (!questionComment) {
      return null;
    }

    return PrismaQuestionCommentMapper.toDomain(questionComment);
  }

  async findManyByQuestionId(
    id: string,
    { page }: PaginationParams
  ): Promise<QuestionComment[]> {
    const questionsComment = await this.prisma.comment.findMany({
      where: {
        id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return questionsComment.map(PrismaQuestionCommentMapper.toDomain);
  }

  async create(questionComment: QuestionComment): Promise<void> {
    const data = PrismaQuestionCommentMapper.toPrisma(questionComment);

    await this.prisma.comment.create({
      data,
    });
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id: questionComment.id.toString(),
      },
    });
  }
}
