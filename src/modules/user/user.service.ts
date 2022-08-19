import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RegisterInput } from '../auth/dto/register-input.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async createUser(input: RegisterInput) {
    return this.repository.save(plainToInstance(User, input));
  }

  async findById(id: number): Promise<User> {
    return this.repository.findOne({
      where: { id },
    });
  }
}
