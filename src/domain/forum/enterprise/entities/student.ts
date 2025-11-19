import { Entity } from '@/core/entities/entity';
import type { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface StudentProsps {
  name: string;
}

export class Student extends Entity<StudentProsps> {
  static create(props: StudentProsps, id?: UniqueEntityID) {
    const student = new Student(props, id);

    return student;
  }
}
