import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { saltOrRounds } from 'utilies/constant';
;

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel:Model<User>) {  }


  async create(createUserDto: CreateUserDto):Promise<{status:number,message:string,data:User}> {
    const ifUserExist = await this.userModel.findOne({email:createUserDto.email});
    if(ifUserExist){
      throw new HttpException('User already exist',400);
    }

    const password = await this.hasPassword(createUserDto.password);
    const user={
      password,
      role:createUserDto.role ??'user',
      active:true
    }
    return {
      status:200,
      message:'User created successfully',
      data:await this.userModel.create({...createUserDto,...user}),
    };
  }

  async findAll(query) {
    const {_limit=1000_000_000,name,sort='asc',skip=0,email,role}=query;
    if(Number.isNaN(Number(+_limit))){
      throw new HttpException('Invalid limit',400);
    }
    if(Number.isNaN(Number(+skip))){
      throw new HttpException('Invalid skip',400);
    }
    if(!["asc","desc"].includes(sort)){
      throw new HttpException("Invalid sort",400);
    }
    const filterUsers = await this.userModel.find().
    select('-password -__v').
    skip(skip)
    .limit(_limit)
    .where('name',new RegExp(name,'i'))
    .where('email',new RegExp(email,'i'))
    .where('role',new RegExp(role,'i'))
    .sort({name:sort})
    .exec()
    return {
      status:200,
      message:'Users found sucessfully',
      length:filterUsers.length,
      data:filterUsers,
  };
  }

  async findOne(id: string):Promise<{status:number,data:User}> {
    const user = await this.userModel.findById(id).select('-password -__v');
    if(!user){
      throw new NotFoundException('User not found');
    }
    return {
      status:200,
      data:user
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto):Promise<{status:number,message:string,data:User}> {
    const user = await this.userModel.findById(id).select('-password -__v');
    if(!user){
      throw new NotFoundException('User not found');
    }
    if(updateUserDto.password){
      updateUserDto.password=await this.hasPassword(updateUserDto.password);
    }
    Object.assign(user,updateUserDto);
    await user.validate();
    await user.save();
    return{
      status:200,
      message:'User updated successfully',
      data:user,
    }
  }

  async remove(id: string):Promise<{status:number,message:string}> {
    const user = await this.userModel.findById(id).select('-password -__v');
    if(!user){
      throw new NotFoundException('User not found');
    }
    await this.userModel.findByIdAndDelete(id);
    return{
      status:200,
      message:"User deleted sucessfully"
    } ;
  }

  // =======================================================================================
  // ========================User Can Get Data======================== 
  async getMe(payload){
    if(!payload._id) throw new NotFoundException('User not found');
    const user = await this.userModel.findById(payload._id).select('-password -__v');
    if(!user){
      throw new NotFoundException('User not found');
    }
    return {
      status:200,
      message:'user found',
      data:user
    };
  }

  async updateMe(payload,updateUserDto:UpdateUserDto){
    if(!payload._id) throw new NotFoundException('User not found');
    const user = await this.userModel.findById(payload._id).select('-password -__v');
    if(!user){
      throw new NotFoundException('User not found');
    }
    Object.assign(user,{...payload,...updateUserDto});
    await user.save()
    return {
      status:200,
      message:'user updated sucessfully',
      data:user
    };
  }

  async deleteMe(payload){
    if(!payload._id){
      throw new NotFoundException('User not found');
    }
    const user = await this.userModel.findById(payload._id).select('-password -__v');
    if(!user){
      throw new NotFoundException('User not found');
    }
    return {
      status:200,
      message:'User deleted successfully',
      data:await this.userModel.findByIdAndUpdate(payload._id,{active:false},{new:true,runValidators:true})
    } 
  }


  async hasPassword(password:string):Promise<string>{
    const salt = await bcrypt.genSalt(saltOrRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  
}


