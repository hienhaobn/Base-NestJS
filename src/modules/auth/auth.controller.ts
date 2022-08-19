import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  BaseApiErrorResponse,
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from 'src/shared/dto/response.dto';
import { AppLogger } from 'src/shared/logger/logger.service';
import { ReqContext } from 'src/shared/request-context/req-context.decorator';
import { RequestContext } from 'src/shared/request-context/request-context.dto';
import { AuthService } from './services/auth.service';
import { AuthOutput } from './dto/auth-output.dto';
import { AuthTokenOutput } from './dto/auth-token-output.dto';
import { RegisterInput } from './dto/register-input.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly logger: AppLogger,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @ApiOperation({
    summary: 'User registration API',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(AuthOutput),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async signUp(
    @ReqContext() ctx: RequestContext,
    @Body() input: RegisterInput,
  ): Promise<BaseApiResponse<AuthOutput>> {
    const response = await this.authService.register(ctx, input);
    return {
      data: response,
      meta: {},
    };
  }

  @Post('login')
  @ApiOperation({
    summary: 'User login API',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(AuthTokenOutput),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async signIn(
    @ReqContext() ctx: RequestContext,
  ): Promise<BaseApiResponse<AuthTokenOutput>> {
    const response = await this.authService.login(ctx);
    return {
      data: response,
      meta: {},
    };
  }
}
