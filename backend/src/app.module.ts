import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiModule } from './ai/ai.module';
import { MarketDataModule } from './market-data/market-data.module';
import { PrismaModule } from './prisma/prisma.module';
import { StocksModule } from './stocks/stocks.module';
import { ValuationModule } from './valuation/valuation.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ValuationModule,
    MarketDataModule,
    AiModule,
    StocksModule,
  ],
})
export class AppModule {}
