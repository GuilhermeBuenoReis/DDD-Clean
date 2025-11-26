import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { env } from './env';

@Injectable()
export class EnvService {
  constructor(private envService: ConfigService<env, true>) {}

  get<T extends keyof env>(key: T) {
    return this.envService.get<T>(key, { infer: true });
  }
}
