import { Module } from '@nestjs/common';
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

@Module({
  imports: [],
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
})
export class AccountModule {}
