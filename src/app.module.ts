import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';


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

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
