import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { authenticator } from 'otplib';
import { AppLogger } from 'src/shared/logger/logger.service';

@Injectable()
export class TwoFactorAuthService {
  constructor(
    private readonly logger: AppLogger,
    private readonly configService: ConfigService,
  ) {}
}
