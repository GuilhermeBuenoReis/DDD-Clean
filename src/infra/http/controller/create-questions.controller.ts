import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/infra/auth/current-user-decorator';
import { JwtAuthGuard } from 'src/infra/auth/jwt.auth.guard';
import type { UserPayload } from 'src/infra/auth/jwt-strategy';
import { ZodValidationPipe } from 'src/infra/http/pipes/zod-validation-pipes';
import z from 'zod';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question.use-case';

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema);

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private createQuestion: CreateQuestionUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload
  ) {
    const { title, content } = body;
    const { sub: userId } = user;

    await this.createQuestion.execute({
      title,
      content,
      authorId: userId,
      attachmentsIds: [],
    });
  }
}
