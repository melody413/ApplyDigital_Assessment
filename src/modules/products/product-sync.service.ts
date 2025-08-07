import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';

@Injectable()
export class ProductSyncService {
  private readonly logger = new Logger(ProductSyncService.name);

  // Ideally, move these to environment variables or config service
  private readonly contentfulUrl =
    'https://cdn.contentful.com/spaces/9xs1613l9f7v/environments/master/entries';
  private readonly accessToken = 'I-ThsT55eE_B3sCUWEQyDT4VqVO3x__20ufuie9usns';
  private readonly contentType = 'product';
  private readonly limit = 100;

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
        skip += this.limit;
      } catch (error) {
        this.logger.error('Error fetching products from Contentful', error);
        break;
      }
    } while (fetched < total);
    this.logger.log('Contentful product sync complete.');
  }
}
