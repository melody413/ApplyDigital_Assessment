import { Controller, Get, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductSyncService } from './modules/products/product-sync.service';

@ApiTags('Public-App')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly productSyncService: ProductSyncService,
  ) {}

  @Get()
  checkHealth(): string {
    return this.appService.checkHealth();
  }

  @Post('products/sync')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Manually trigger Contentful product sync' })
  @ApiResponse({ status: 202, description: 'Product sync started' })
  async triggerProductSync() {
    this.productSyncService.syncProductsFromContentful();
    return { message: 'Product sync started' };
  }
}
