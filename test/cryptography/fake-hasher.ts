import type { HashCompare } from '@/domain/cryptography/hash-comparer';
import type { HashGenerator } from '@/domain/cryptography/hash-generator';

export class FakeHasher implements HashGenerator, HashCompare {
  async hash(plain: string): Promise<string> {
    return plain.concat('_hashed');
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('_hashed') === hash;
  }
}
