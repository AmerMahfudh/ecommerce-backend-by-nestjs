import { HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import {   ResetPasswordDto, SignInDto, SignUpDto } from './dto/auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Model } from 'mongoose';
import { UserService } from './../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { MailerService } from '@nestjs-modules/mailer';



@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private readonly userModel:Model<User>,
                private readonly userService:UserService,
                private readonly jwtService:JwtService,
                private readonly configService:ConfigService,
                private readonly mailService:MailerService
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

    async resetPassword({email}:ResetPasswordDto){
      const user = await this.userModel.findOne({email:email});
      if(!user){
        throw new NotFoundException("User Not Found");
      }
      const code = Math.floor(Math.random()*1000000).toString().padStart(6,'0');
      await this.userModel.findOneAndUpdate({email:email},{verificationCode:code},{runValidators:true});
      const Htmlmessage = `
        <div style="font-family: Arial, sans-serif; margin: 20px; padding: 20px; border: 1px solid #ccc; border-radius: 8px; background-color: #f9f9f9;">
            <h1 style="color: #333; text-align: center; font-size: 24px;">Forgot your password? If you didn't forget your password, please ignore this email!</h1>
            <p style="font-size: 16px; color: #555; line-height: 1.5; text-align: center;">Use the following code to verify your account:</p>
            <h3 style="color: #4CAF50; text-align: center; font-size: 28px; font-weight: bold;">${code}</h3>
            <p style="font-size: 14px; color: #777; text-align: center;">If you didn’t request a password reset, please ignore this email. If you have any issues, contact support.</p>
            <h6 style="font-size: 12px; color: #888; text-align: center; font-style: italic;">Ecommerce-Nest.Js</h6>
        </div>
      `;

    this.mailService.sendMail({
        from: `Ecommerce-Nest.Js <${this.configService.get<string>('EMAIL_USERNAME')}>`,
        to: email,
        subject: `Ecommerce-Nest.Js - Reset Password`,
        html: Htmlmessage,
      });
      return {
        status:200,
        message:`code sent successfully on your email (${email})`,

      };
    }


    async verifyCode({email,code}:{email:ResetPasswordDto,code:string}){
        const user = await this.userModel.findOne({email:email}).select('verificationCode');
        if(!user){
          throw new NotFoundException('User Not Found');
        }
        if(user.verificationCode !==code){
          throw new UnauthorizedException('Invalid code');
        }
        await this.userModel.findOneAndUpdate({email},{verificationCode:null});
        return{
          status:200,
          message:`code verified succesfully, go to change your password`,
        }
    }

    async changePassword({email,password}:SignInDto){
      const user = await this.userModel.findOne({email:email}).select('verificationCode');
        if(!user){
          throw new NotFoundException('User Not Found');
        }
        const passwordHash = await this.userService.hasPassword(password);
        await this.userModel.findOneAndUpdate({email},{passwordHash});
      return{
        status:200,
        message:`Password changed successfully,go to login`,
      }
    }
}
