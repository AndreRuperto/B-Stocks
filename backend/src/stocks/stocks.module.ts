import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { MarketDataModule } from '../market-data/market-data.module';
import { ValuationModule } from '../valuation/valuation.module';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';

@Module({
  imports: [MarketDataModule, ValuationModule, AiModule],
  controllers: [StocksController],
  providers: [StocksService],
  exports: [StocksService],
})
export class StocksModule {}
