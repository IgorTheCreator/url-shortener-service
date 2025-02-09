import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  onModuleDestroy() {
    this.redis.disconnect();
  }

  async get(key: string) {
    return this.redis.get(key);
  }

  async set(key: string, value: string) {
    await this.redis.set(key, value, 'EX', 3600);
  }

  async delete(key: string) {
    await this.redis.del(key);
  }
}
