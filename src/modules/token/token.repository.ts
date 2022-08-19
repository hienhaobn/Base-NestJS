import { EntityRepository, Repository } from 'typeorm';
import { Token } from './token.entity';

@EntityRepository(Token)
export class TokenRepository extends Repository<Token> {
  async delete(conditions: any) {
    try {
      const response = await this.delete(conditions);
      return response.affected > 0;
    } catch (error) {
      console.error('[TokenRepository delete] error', error);
    }
  }
}
