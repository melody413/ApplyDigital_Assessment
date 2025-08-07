import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './models/product.schema';
import { ProductFilterDto } from './dto/product-filter.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async findAll(filterDto: ProductFilterDto, page = 1, limit = 5) {
    const query: Record<string, unknown> = { deleted: { $ne: true } };

    // Filtering by name (case-insensitive)
    if (filterDto.name) {
      query.name = { $regex: filterDto.name, $options: 'i' };
    }

    // Filtering by category
    if (filterDto.category) {
      query.category = filterDto.category;
    }

    // Filtering by price range
    if (filterDto.minPrice !== undefined || filterDto.maxPrice !== undefined) {
      query.price = {};
      if (filterDto.minPrice !== undefined) {
        (query.price as Record<string, number>).$gte = filterDto.minPrice;
      }
      if (filterDto.maxPrice !== undefined) {
        (query.price as Record<string, number>).$lte = filterDto.maxPrice;
      }
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.productModel.find(query).skip(skip).limit(limit).exec(),
      this.productModel.countDocuments(query),
    ]);

    return {
      items,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async remove(id: string) {
    const product = await this.productModel.findOne({
      contentfulId: id,
      deleted: { $ne: true },
    });
    if (!product || product.deleted) {
      throw new NotFoundException('Product not found');
    }
    product.deleted = true;
    await product.save();
    return { message: 'Product removed successfully' };
  }
}
