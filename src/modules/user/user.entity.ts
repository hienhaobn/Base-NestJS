import {
  IsDefined,
  IsNotEmpty,
  MaxLength,
  MinLength,
  validateOrReject,
} from 'class-validator';
import { MyBaseEntity } from '../../shared/orm/base.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { USER_CONSTRAINTS } from './user.constant';

@Entity()
@Unique(['username'])
export class User extends MyBaseEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    name: 'first_name',
  })
  @MaxLength(USER_CONSTRAINTS.NAME.MAX_LENGTH)
  @MinLength(USER_CONSTRAINTS.NAME.MIN_LENGTH)
  firstName: string;

  @Column({
    name: 'last_name',
  })
  @MaxLength(USER_CONSTRAINTS.NAME.MAX_LENGTH)
  @MinLength(USER_CONSTRAINTS.NAME.MIN_LENGTH)
  lastName: string;

  @Column()
  @IsDefined()
  @IsNotEmpty()
  username: string;

  @Column()
  @IsDefined()
  @IsNotEmpty()
  password: string;

  @BeforeInsert()
  @BeforeUpdate()
  private validate(): Promise<void> {
    return validateOrReject(this);
  }
}
