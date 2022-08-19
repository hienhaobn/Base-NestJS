import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [ConfigModule.forRoot()],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
