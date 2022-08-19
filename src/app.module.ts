import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { SlackLoggerBotModule } from './modules/bots/slack/slack-bot.module';

@Module({
  imports: [AuthModule, SlackLoggerBotModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
