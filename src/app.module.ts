import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env"//process.env.NODE_ENV !== 'production'? `.env.${process.env.NODE_ENV}`:".env"
    }),
    MongooseModule.forRootAsync({
      inject:[ConfigService],
      useFactory:(config:ConfigService)=>{
        const dbUrl = config.get<string>('DATABASE_URL');
        console.log('DATABASE_URL =>', dbUrl);
        return{
          uri:dbUrl,
        }
      }
    }), 
    UserModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        global:true,
        secret: config.get<string>('JWT_SECRET'),
        signOptions:{expiresIn:config.get<string>('JWT_EXPIRES_IN')}
      }),
    }),
    AuthModule,
    MailerModule.forRootAsync({
      inject:[ConfigService],
      useFactory:(configService:ConfigService)=>{
        return {
          transport: {
            service: 'gmail',
            auth: {
              user: configService.get<string>('EMAIL_USERNAME'),
              pass: configService.get<string>('EMAIL_PASSWORD'),
            },
          },
        };
      }
    }),

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
