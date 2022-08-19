import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SlackBotService } from './slack-bot.service';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  providers: [SlackBotService],
  exports: [SlackBotService],
})
export class SlackLoggerBotModule {}
