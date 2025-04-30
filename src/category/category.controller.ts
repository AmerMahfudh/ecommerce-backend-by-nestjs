import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UseGuards, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from 'src/user/Guards/Auth.guard';
import { Roles } from 'src/user/decorators/Roles.decorator';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  create(@Body(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }),) createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll(@Query()query) {
    return this.categoryService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }),) updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
