import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { Product } from './models/product.schema';

@Injectable()
export class ProductSyncService {
  private readonly logger = new Logger(ProductSyncService.name);

  // Ideally, move these to environment variables or config service
  private readonly contentfulUrl =
    'https://cdn.contentful.com/spaces/9xs1613l9f7v/environments/master/entries';
  private readonly accessToken = 'I-ThsT55eE_B3sCUWEQyDT4VqVO3x__20ufuie9usns';
  private readonly contentType = 'product';
  private readonly limit = 100;

  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async syncProductsFromContentful() {
    this.logger.log('Starting scheduled Contentful product sync...');
    let skip = 0;
    let total = 0;
    let fetched = 0;
    do {
      const url = `${this.contentfulUrl}?access_token=${this.accessToken}&content_type=${this.contentType}&skip=${skip}&limit=${this.limit}`;
      try {
        const response = await axios.get(url);
        const data = response.data;
        total = data.total;
        fetched += data.items.length;
        this.logger.log(`Fetched ${data.items.length} products (skip: ${skip})`);
        // Upsert each product
        for (const item of data.items) {
          const mapped = {
            contentfulId: item.sys.id,
            sku: item.fields.sku,
            name: item.fields.name,
            brand: item.fields.brand,
            productModel: item.fields.model,
            category: item.fields.category,
            color: item.fields.color,
            price: item.fields.price,
            currency: item.fields.currency,
            stock: item.fields.stock,
            sys: item.sys,
            metadata: item.metadata,
          };
          await this.productModel.updateOne(
            { contentfulId: mapped.contentfulId },
            { $set: mapped },
            { upsert: true },
          );
        }
        skip += this.limit;
      } catch (error) {
        this.logger.error('Error fetching products from Contentful', error);
        break;
      }
    } while (fetched < total);
    this.logger.log('Contentful product sync complete.');
  }
}
