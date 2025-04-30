import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category.name) private readonly categoryModel:Model<Category>){}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryModel.findOne({name:createCategoryDto.name});
    if(category){
      throw new HttpException('category already exist',400);
    }
    const newCategory = await this.categoryModel.create(createCategoryDto);

    return{
      status:200,
      message:"category created successfully",
      data:newCategory
    } ;
  }

  async findAll(query) {
    const {name } = query;
    const categories = await this.categoryModel.find().where('name',new RegExp(name,'i'));
    return {
      status:200,
      message:"categories found",
      length:categories.length,
      isEmpty:categories.length!==0?"false":"true",
      data:categories
    };
  }

  async findOne(id: string) {
    const category = await this.categoryModel.findOne({_id:id}).select('-__v');
    if(!category){
      throw new NotFoundException('category not found');
    }

    return {
      status:200,
      message:"category found",
      data:category
    };
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryModel.findOne({_id:id});
    if(!category){
      throw new NotFoundException('category not found');
    }
    const updatedCategory = await this.categoryModel.findOneAndUpdate({_id:id},updateCategoryDto,{new:true,runValidators:true}).select('-__v');
    return {
      status:200,
      message:"category updated successfully",
      data:updatedCategory
    };
  }

  async remove(id: string) {
    const category = await this.categoryModel.findOne({_id:id});
    if(!category){
      throw new NotFoundException('category not found');
    }
    await this.categoryModel.deleteOne({_id:id});
    return {

        status:200,
        message:"category deleted successfully",
    };
  }
}
