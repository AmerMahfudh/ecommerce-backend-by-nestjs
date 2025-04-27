import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import {  SignInDto, SignUpDto } from './dto/auth.dto';


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
  
}
