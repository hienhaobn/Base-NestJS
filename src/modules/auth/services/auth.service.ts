import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import { UserAccessTokenClaims } from 'src/shared/dto/token-claim';
import { AppLogger } from 'src/shared/logger/logger.service';
import { RequestContext } from 'src/shared/request-context/request-context.dto';
import { Token } from '../../token/token.entity';
import { TokenRepository } from '../../token/token.repository';
import { User } from '../../user/user.entity';
import { UserRepository } from '../../user/user.repository';
import { AuthOutput } from '../dto/auth-output.dto';
import { AuthTokenOutput } from '../dto/auth-token-output.dto';
import { RegisterInput } from '../dto/register-input.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly logger: AppLogger,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
    private readonly configService: ConfigService,
  ) {}

  private async getAuthToken(
    ctx: RequestContext,
    user: UserAccessTokenClaims,
  ): Promise<AuthTokenOutput> {
    this.logger.log(ctx, `${this.getAuthToken.name} was called`);

    const subject = { sub: user.id };
    const payload = {
      username: user.username,
      sub: user.id,
    };

    const authToken = {
      refreshToken: this.jwtService.sign(subject, {
        expiresIn: this.configService.get('jwt.refreshTokenExpiresInSec'),
      }),
      accessToken: this.jwtService.sign(
        { ...payload, ...subject },
        { expiresIn: this.configService.get('jwt.accessTokenExpiresInSec') },
      ),
    };
    await this.tokenRepository.save(
      plainToInstance(Token, {
        userId: user.id,
        expiresIn: this.configService.get('jwt.accessTokenExpiresInSec'),
        ...authToken,
      }),
    );

    return plainToInstance(AuthTokenOutput, authToken, {
      excludeExtraneousValues: true,
    });
  }

  async register(
    ctx: RequestContext,
    input: RegisterInput,
  ): Promise<AuthOutput> {
    this.logger.log(ctx, `${this.register.name} was called`);
    const newUser = await this.userRepository.save(
      plainToInstance(User, input),
    );
    const { accessToken, refreshToken } = await this.getAuthToken(ctx, newUser);
    return {
      user: newUser,
      accessToken,
      refreshToken,
    };
  }

  async login(ctx: RequestContext): Promise<AuthTokenOutput> {
    this.logger.log(ctx, `${this.login.name} was called`);
    return this.getAuthToken(ctx, ctx.user);
  }
}
