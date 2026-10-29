import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { StocksService } from './stocks/stocks.service';

async function runSeed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const stocksService = app.get(StocksService);
  await stocksService.syncAllB3Stocks();
  await app.close();
}

runSeed();
