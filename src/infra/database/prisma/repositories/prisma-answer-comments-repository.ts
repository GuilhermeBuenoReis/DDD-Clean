import { Injectable } from '@nestjs/common';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comments-repository';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answers-comment';
import { PrismaAnswerCommentMapper } from '../mappers/prisma-answer-comment-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaAnswerCommentRepository implements AnswerCommentRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<AnswerComment | null> {
    const answerComment = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    });

    if (!answerComment) {
      return null;
    }

    return PrismaAnswerCommentMapper.toDomain(answerComment);
  }

  async findManyByAnswerId(
    id: string,
    { page }: PaginationParams
  ): Promise<AnswerComment[]> {
    const answersComment = await this.prisma.comment.findMany({
      where: {
        id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return answersComment.map(PrismaAnswerCommentMapper.toDomain);
  }

  async create(answerComment: AnswerComment): Promise<void> {
    const data = PrismaAnswerCommentMapper.toPrisma(answerComment);

    await this.prisma.comment.create({
      data,
    });
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id: answerComment.id.toString(),
      },
    });
  }
}
