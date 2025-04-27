import { IsBoolean, IsEmail,
        IsEnum, IsNumber, 
        IsOptional, IsPhoneNumber, 
        IsString, IsUrl, 
        Length, MaxLength, 
        Min, MinLength 
    } from "class-validator";



export class SignUpDto {

    @IsString({message:"Name must be a string"})
    @MinLength(3,{message:"Name must be at least 3 characters"})
    @MaxLength(30,{message:"Name must be at most 30 characters"})
    name:string;
    @IsString({message:"email must be a string"}) 
    @IsEmail({},{message:"Email is not valid"})
    @MinLength(0,{})
    email:string;
    @IsString({message:"Password must be a string"})
    @MinLength(3,{message:"password must be at least 3 characters"})
    @MaxLength(20,{message:"password must be at most 20 characters"})
    password:string;
    @IsString({message:"Avatar must be a string"})
    @IsUrl({},{message:"avatar must be valid url"})
    @IsOptional()
    avatar:string;
    @IsNumber({},{message:"age must be a number"})
    @Min(18,{message:"age must be at least 18 years old"})
    @IsOptional()
    age:number;
    @IsString({message:"phoneNumber must be a string"})
    @IsPhoneNumber("SY",{message:"phoneNumber must be a valid phone number"})
    @IsOptional()
    phoneNumber:string;
    @IsString({message:"Address must be a string"})
    @IsOptional()
    address:string;
    @IsBoolean({message:"active must be a boolean"})
    @IsEnum([true,false],{message:"active must be true or false"})
    @IsOptional()
    active:boolean;
    @IsString({message:"Verification Code must be a string"})
    @Length(6,6,{message:"verification code must be 6 characters"})
    @IsOptional()
    verificationCode:string;
    @IsString({message:"gender must be string"})
    @IsEnum(['male','female'],{message:"gender must be male or female"})
    @IsOptional()
    gender:string;
}


export class SignInDto{
    @IsString({message:"email must be a string"}) 
    @IsEmail({},{message:"Email is not valid"})
    @MinLength(0,{})
    email:string;
    @IsString({message:"Password must be a string"})
    @MinLength(3,{message:"password must be at least 3 characters"})
    @MaxLength(20,{message:"password must be at most 20 characters"})
    password:string;
}
