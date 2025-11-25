import { compare, hash } from 'bcryptjs';
import type { HashComparer } from '@/domain/cryptography/hash-comparer';
import type { HashGenerator } from '@/domain/cryptography/hash-generator';

export class BcryptHasher implements HashGenerator, HashComparer {
  async hash(plain: string): Promise<string> {
    return hash(plain, 8);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash);
  }
}
