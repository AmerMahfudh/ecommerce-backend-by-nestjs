import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import * as mongooseUniqueValidator from 'mongoose-unique-validator';
import { JwtModule } from '@nestjs/jwt';
import { UserMeController } from './normal-user.controller';
@Module({
  imports:[MongooseModule.forFeatureAsync([{ name: User.name,
    useFactory: () => {
      const schema = UserSchema;
      schema.plugin(mongooseUniqueValidator, {
        message: 'Your email already exists!',
      });
      return schema;
  },}]),
  JwtModule
  ],
  controllers: [UserController,UserMeController],
  providers: [UserService],
  exports:[UserService]
})
export class UserModule {}
