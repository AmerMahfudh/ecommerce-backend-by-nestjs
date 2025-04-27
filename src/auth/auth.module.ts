import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import * as mongooseUniqueValidator from 'mongoose-unique-validator';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[
    MongooseModule.forFeatureAsync([{ name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.plugin(mongooseUniqueValidator, {
            message: 'Your email already exists!',
          });
          return schema;
      },}]),
      UserModule,
      JwtModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
