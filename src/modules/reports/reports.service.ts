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
      deletedCount: deleted,
      totalCount: total,
    };
  }

  async getNonDeletedPercentage(withPrice?: boolean, dateRange?: DateRangeDto) {
    const filter: Record<string, unknown> = { deleted: { $in: [false, null] } };

    if (withPrice !== undefined) {
      filter.price = withPrice ? { $ne: null } : null;
    }

    if (dateRange?.from || dateRange?.to) {
      filter.updatedAt = {};
      if (dateRange.from)
        (filter.updatedAt as Record<string, unknown>)['$gte'] = new Date(
          dateRange.from,
        );
      if (dateRange.to)
        (filter.updatedAt as Record<string, unknown>)['$lte'] = new Date(
          dateRange.to,
        );
    }

    const total = await this.productModel.countDocuments();
    const filtered = await this.productModel.countDocuments(filter);

    return {
      nonDeletedPercentage: total ? (filtered / total) * 100 : 0,
      count: filtered,
      totalCount: total,
    };
  }

  async getNonDeletedWithoutPricePercentage(dateRange?: DateRangeDto) {
    return this.getNonDeletedPercentage(false, dateRange);
  }

  async getSummaryReport(withPrice?: boolean, dateRange?: DateRangeDto) {
    const deleted = await this.getDeletedPercentage();
    const nonDeleted = await this.getNonDeletedPercentage(withPrice, dateRange);
    const nonDeletedWithoutPrice =
      await this.getNonDeletedWithoutPricePercentage(dateRange);

    return {
      deletedPercentage: deleted.deletedPercentage,
      deletedCount: deleted.deletedCount,
      nonDeletedPercentage: nonDeleted.nonDeletedPercentage,
      nonDeletedCount: nonDeleted.count,
      nonDeletedWithoutPricePercentage:
        nonDeletedWithoutPrice.nonDeletedPercentage,
      nonDeletedWithoutPriceCount: nonDeletedWithoutPrice.count,
      totalCount: deleted.totalCount,
    };
  }

  async getProductsByCategory() {
    return this.productModel.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { category: '$_id', count: 1, _id: 0 } },
    ]);
  }
}
