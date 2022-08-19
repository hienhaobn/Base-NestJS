import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis, { Cluster } from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redis: Redis | Cluster;

  constructor(private readonly configService: ConfigService) {
    this.redis = new Redis(
      configService.get<number>('redis.port'),
      configService.get<string>('redis.host'),
      {
        password: configService.get<string>('redis.password'),
      },
    );
  }

  async get(key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.redis.get(key, function (err, result) {
        if (err) {
          reject(err);
        }

        // reply is null when the key is missing
        resolve(result);
      });
    });
  }

  async set(key: string, value: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.redis.set(key, value, function (err, result) {
        if (err) {
          reject(err);
        }
        // reply is null when the key is missing
        resolve(result);
      });
    });
  }
}
