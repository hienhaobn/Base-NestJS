import { Global, Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { TokenService } from './token.service';

@Global()
@Module({
  imports: [SharedModule],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
