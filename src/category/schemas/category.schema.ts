import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type categoryrDocument = HydratedDocument<Category>;

@Schema({timestamps:true})
export class Category {
    @Prop({type:String,required:true,minlength:[3,"Name must be at least 3 characters"],maxlength:[30,"Name must be at most 30 characters"]})
    name: string;

    @Prop({type:String})
    image:string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
