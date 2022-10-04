import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserRepositoryKnexImpl } from './repositories/user.repository';
import { UserService } from './services/user.service';
import { UserRepository } from './abstractions/user';
import { Encrypter } from '../common/abstractions/encrypter';
import { BcryptAdapter } from '../common/utils/bcrypt-adpater';
import { SchoolController } from './controllers/school.controller';
import { SchoolService } from './services/school.service';
import { SchoolRepository } from './abstractions/school';
import { SchoolRepositoryKnexImpl } from './repositories/school.repository';
import { AuthModule } from '../auth/auth.module';
import { AWSModule } from '../aws/aws.module';

@Module({
  imports: [forwardRef(() => AuthModule), AWSModule],
  controllers: [UserController, SchoolController],
  providers: [
    UserService,
    { provide: UserRepository, useClass: UserRepositoryKnexImpl },
    {
      provide: Encrypter,
      useValue: new BcryptAdapter(Number(process.env.ENCRYPT_SALT) || 7),
    },
    SchoolService,
    { provide: SchoolRepository, useClass: SchoolRepositoryKnexImpl },
  ],
  exports: [UserService],
})
export class AccountModule {}
