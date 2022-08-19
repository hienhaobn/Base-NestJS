import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

import { SLACK_BOT_CONSTANTS } from './slack-bot.constant';

@Injectable()
export class SlackBotService {
  private logs: string[] = [];
  private lastSentLogsTime: Date | undefined;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  private shouldSendLogs() {
    if (this.logs.length >= SLACK_BOT_CONSTANTS.MAX_MESSAGES_PER_BATCH)
      return true;

    const totalLength = this.logs.reduce((acc, cur) => acc + cur.length, 0);
    if (totalLength >= SLACK_BOT_CONSTANTS.MAX_MESSAGES_PER_BATCH_LENGTH)
      return true;

    if (
      this.lastSentLogsTime &&
      new Date().getTime() - this.lastSentLogsTime.getTime() >
        SLACK_BOT_CONSTANTS.MAX_MESSAGES_PER_BATCH_TIME
    )
      return true;

    return false;
  }

  private async sendLogs() {
    /**
     * We accept lossy messages, so we don't need to worry about the message queue overflowing.
     */
    try {
      const bulkLogs = JSON.stringify(this.logs);
      for (
        let i = 0;
        i < bulkLogs.length;
        i += SLACK_BOT_CONSTANTS.MAX_MESSAGE_LENGTH
      ) {
        const chunk = bulkLogs.substring(
          i,
          i + SLACK_BOT_CONSTANTS.MAX_MESSAGE_LENGTH,
        );
        await firstValueFrom(
          this.httpService.post(
            this.configService.get<string>('slack.webhook'),
            {
              text: chunk,
            },
          ),
        );
      }
    } catch (error) {
      console.error('[SlackBotService.sendMessage] error', error);
    }
    this.logs = [];
    this.lastSentLogsTime = new Date();
  }

  async pushLogs(log: string): Promise<void> {
    this.logs.push(log);
    if (this.shouldSendLogs()) {
      await this.sendLogs();
    }
  }
}
