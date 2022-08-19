import { Injectable } from '@nestjs/common';
import { Token } from './token.entity';
import { TokenRepository } from './token.repository';

@Injectable()
export class TokenService {
  constructor(private readonly repository: TokenRepository) {}

  async create(token: Token): Promise<Token> {
    return this.repository.save(token);
  }
}
