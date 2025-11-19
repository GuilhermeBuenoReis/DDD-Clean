import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/infra/auth/jwt.auth.guard';
import { ZodValidationPipe } from 'src/infra/http/pipes/zod-validation-pipes';
import z from 'zod';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const perPage = 20;
    const skipPage = (page - 1) * 1;

    const questions = await this.prisma.question.findMany({
      take: perPage,
      skip: skipPage,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { questions };
  }
}
