import { IsString, IsUrl, MaxLength, MinLength } from "class-validator";






export class CreateCategoryDto {
    
    @IsString({message:"Name must be a string"})
    @MinLength(3,{message:"Name must be at least 3 characters"})
    @MaxLength(30,{message:"Name must be at most 30 characters"})
    name:string


    @IsString({message:"image must be a string"})
    @IsUrl({},{message:"image must be a valid URL"})
    image:string;
}
