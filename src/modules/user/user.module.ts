import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { UserService } from './user.service';

@Module({
  imports: [SharedModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
