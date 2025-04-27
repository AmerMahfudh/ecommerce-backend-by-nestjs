import { HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import {  SignInDto, SignUpDto } from './dto/auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Model } from 'mongoose';
import { UserService } from './../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';



@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private readonly userModel:Model<User>,
                private readonly userService:UserService,
                private readonly jwtService:JwtService,
                private readonly configService:ConfigService
  ){}

    async singUp(signUpDto:SignUpDto){
      const user =await this.userModel.findOne({email:signUpDto.email});
      if(user){
          throw new HttpException('User already exist',400);
      }
      const password:string = await this.userService.hasPassword(signUpDto.password);
      const UserCreated = {
        password,
        role:'user',
        active:true
      }
      const newUser =await this.userModel.create({...signUpDto,...UserCreated});
      const payload = {
        _id:newUser._id,
        email:newUser.email,
        role:newUser.role
      };
      const token = await this.jwtService.signAsync(payload,{
        secret:this.configService.get<string>('JWT_SECRET')
      })
      return {
        status:200,
        message:'user created sucessfully',
        data:newUser,
        access_token:token
      }
    }

    async signIn(signInDto:SignInDto){
      const user = await this.userModel.findOne({email:signInDto.email});
      if(!user){
        throw new NotFoundException('User Not Found');
      }
      const isMatch = await bcrypt.compare(signInDto.password, user.password);

      if(!isMatch){
        throw new UnauthorizedException();
      } 
      const payload = {
        _id:user._id,
        email:user.email,
        role:user.role
      };
      const token = await this.jwtService.signAsync(payload,{secret:this.configService.get<string>('JWT_SECRET')});
      return{
        status:200,
        message:'User logged in successfully',
        data:user,
        access_token:token
      }
    }

}
