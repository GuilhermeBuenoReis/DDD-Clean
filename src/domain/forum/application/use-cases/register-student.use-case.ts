import { Injectable } from '@nestjs/common';
import { type Either, left, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { HashGenerator } from '@/domain/cryptography/hash-generator';
import { Student } from '../../enterprise/entities/student';
import { StudentRepository } from '../repositories/student-repository';
import { StudentAlreadyExistError } from './errors/student-already-exist-error';

interface RegisterStudentUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

type RegisterStudentUseCaseResponse = Either<
  StudentAlreadyExistError,
  {
    student: Student;
  }
>;

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private studentRepository: StudentRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const studentSameEmail = await this.studentRepository.findByEmail(email);

    if (studentSameEmail) {
      return left(new StudentAlreadyExistError(email));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const student = Student.create(
      {
        name,
        email,
        password: hashedPassword,
      },
      new UniqueEntityID()
    );

    await this.studentRepository.create(student);

    return right({
      student,
    });
  }
}
