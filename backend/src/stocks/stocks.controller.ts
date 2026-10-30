import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { StocksService } from './stocks.service';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get()
  findAll(@Query() query: Record<string, unknown>) {
    return this.stocksService.findAll(query);
  }

  @Get('summary')
  getSummary() {
    return this.stocksService.getMarketSummary();
  }

  @Get('market-overview')
  getMarketOverview(@Query('period') period?: string) {
    return this.stocksService.getMarketOverview(period);
  }

  @Post('sync')
  syncStocks() {
    return this.stocksService.syncAllB3Stocks();
  }

  @Get(':ticker')
  findOne(@Param('ticker') ticker: string) {
    return this.stocksService.findByTicker(ticker);
  }

  @Post(':ticker/thesis')
  generateThesis(
    @Param('ticker') ticker: string,
    @Body() body?: { apiKey?: string; forceRefresh?: boolean },
  ) {
    return this.stocksService.generateThesisForTicker(
      ticker,
      body?.apiKey,
      body?.forceRefresh ?? false,
    );
  }
}
