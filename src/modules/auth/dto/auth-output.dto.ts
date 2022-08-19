import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { User } from 'src/modules/user/user.entity';

export class AuthOutput {
  @ApiProperty({
    type: User,
  })
  @Expose()
  user: User;

  @ApiProperty()
  @Expose()
  @IsString()
  readonly accessToken: string;

  @ApiProperty()
  @Expose()
  @IsString()
  readonly refreshToken: string;
}
