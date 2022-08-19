import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';
import { Observable } from 'rxjs';

@Injectable()
export class MyTokenAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest(err, user, info: Error) {
    if (err || !user) throw err || new UnauthorizedException(`${info}`);
    if (info instanceof TokenExpiredError) {
      throw new HttpException('Token has expired', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
