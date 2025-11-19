import { Entity } from '@/core/entities/entity';
import type { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface IntructorProps {
  name: string;
}

export class Intructor extends Entity<IntructorProps> {
  get name() {
    return this.props.name;
  }

  static create(props: IntructorProps, id?: UniqueEntityID) {
    const intructor = new Intructor(props, id);

    return intructor;
  }
}
