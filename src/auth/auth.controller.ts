import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import {   ResetPasswordDto, SignInDto, SignUpDto } from './dto/auth.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }),) signUpDto: SignUpDto) {
    return this.authService.singUp(signUpDto);
  }

  @Post('sign-in')
  signIn(@Body(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  })) signInDto:SignInDto){
    return this.authService.signIn(signInDto);
  }
  

  @Post('reset-password')
  resetPassword(@Body(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }),)email:ResetPasswordDto){
    return this.authService.resetPassword(email);
  }

  @Post('verify-code')
  verifyCode(@Body(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }),)verifyCode:{email:ResetPasswordDto,code:string}){
    return this.authService.verifyCode(verifyCode);
  }

  @Post('change-password')
  changePassword(@Body(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }),)password:SignInDto){
    return this.authService.changePassword(password);
  }

}
