import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductSyncService } from './product-sync.service';

@Module({
  imports: [], // MongooseModule removed for now
  controllers: [ProductsController],
  providers: [ProductsService, ProductSyncService],
  exports: [ProductsService],
})
export class ProductsModule {}
