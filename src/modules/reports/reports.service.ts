import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../products/models/product.schema';
import { Model } from 'mongoose';
import { DateRangeDto } from './dto/data-range.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async getDeletedPercentage() {
    const total = await this.productModel.countDocuments();
    const deleted = await this.productModel.countDocuments({ deleted: true });
    return {
      deletedPercentage: total ? (deleted / total) * 100 : 0,
    };
  }

  async getNonDeletedPercentage(withPrice?: boolean, dateRange?: DateRangeDto) {
    const filter: any = { deleted: false };
    if (withPrice !== undefined) {
      filter.price = withPrice ? { $ne: null } : null;
    }
    if (dateRange?.from || dateRange?.to) {
      filter.updatedAt = {};
      if (dateRange.from) filter.updatedAt.$gte = new Date(dateRange.from);
      if (dateRange.to) filter.updatedAt.$lte = new Date(dateRange.to);
    }
    const total = await this.productModel.countDocuments({ deleted: false });
    const filtered = await this.productModel.countDocuments(filter);
    return {
      nonDeletedPercentage: total ? (filtered / total) * 100 : 0,
      count: filtered,
    };
  }

  async getRecentProducts() {
    // Example custom report: 5 most recently updated non-deleted products
    const products = await this.productModel
      .find({ deleted: false })
      .sort({ updatedAt: -1 })
      .limit(5)
      .lean();
    return { recentProducts: products };
  }
}