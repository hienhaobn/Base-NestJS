import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AUTH_HEADER, STRATEGY } from '../constants/strategy.constant';
import Strategy from 'passport-headerapikey';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(
  Strategy,
  STRATEGY.API_KEY,
) {
  constructor(private readonly configService: ConfigService) {
    super(
      {
        header: AUTH_HEADER.API_KEY,
        prefix: '',
      },
      true,
      (apiKey: string, done: any) => {
        return this.validate(apiKey, done);
      },
    );
  }

  validate(apiKey: string, done: any) {
    if (this.configService.get<string>('apiKey') === apiKey) {
      done(null, true);
    }
    done(new UnauthorizedException('Invalid API Key'), null);
  }
}
