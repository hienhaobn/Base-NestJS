import { Expose, Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class UserRefreshTokenClaims {
  @Expose()
  @Type(() => Number)
  readonly id: number;
}

export class UserAccessTokenClaims extends UserRefreshTokenClaims {
  @Expose()
  @IsString()
  readonly username: string;
}
