import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true, unique: true })
  contentfulId: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  sku: string;

  @Prop()
  name: string;

  @Prop()
  brand: string;

  @Prop()
  productModel: string;

  @Prop()
  category: string;

  @Prop()
  color: string;

  @Prop()
  price: number;

  @Prop()
  currency: string;

  @Prop()
  stock: number;

  @Prop({ type: Object })
  sys: any;

  @Prop({ type: Object })
  metadata: any;

  @Prop({ default: false })
  deleted: boolean;
}

export type ProductDocument = Product & Document;

export const ProductSchema = SchemaFactory.createForClass(Product);
