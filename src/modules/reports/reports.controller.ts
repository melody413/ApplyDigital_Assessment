import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { DateRangeDto } from './dto/data-range.dto';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('deleted-percentage')
  async getDeletedPercentage() {
    return this.reportsService.getDeletedPercentage();
  }

  @Get('non-deleted-percentage')
  @ApiQuery({ name: 'withPrice', required: false, type: Boolean })
  @ApiQuery({ name: 'from', required: false, type: String, format: 'date-time' })
  @ApiQuery({ name: 'to', required: false, type: String, format: 'date-time' })
  async getNonDeletedPercentage(
    @Query('withPrice') withPrice?: boolean,
    @Query() dateRange?: DateRangeDto,
  ) {
    return this.reportsService.getNonDeletedPercentage(withPrice, dateRange);
  }

  @Get('recent-products')
  async getRecentProducts() {
    return this.reportsService.getRecentProducts();
  }
}