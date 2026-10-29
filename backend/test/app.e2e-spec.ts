import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('B-Stocks API Integration (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/stocks/summary returns full B3 universe metrics', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/stocks/summary')
      .expect(200);

    expect(res.body.totalStocks).toBeGreaterThanOrEqual(30);
    expect(res.body.passedCutCount).toBeGreaterThan(0);
    expect(Array.isArray(res.body.topRanking)).toBe(true);
    expect(Array.isArray(res.body.categories)).toBe(true);
  });

  it('GET /api/stocks returns paginated stocks and respects filters', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/stocks?onlyPassedCut=true&limit=25&page=1')
      .expect(200);

    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBeGreaterThan(0);
    expect(res.body.items[0].passesCutFilter).toBe(true);
  });

  it('GET /api/stocks/:ticker returns detailed valuation and technical indicators', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/stocks/PETR4')
      .expect(200);

    expect(res.body.ticker).toBe('PETR4');
    expect(typeof res.body.bazinCeilingPrice).toBe('number');
    expect(typeof res.body.grahamFairPrice).toBe('number');
    expect(typeof res.body.sma50).toBe('number');
    expect(typeof res.body.sma200).toBe('number');
    expect(typeof res.body.rsi14).toBe('number');
    expect(typeof res.body.scoreTotal).toBe('number');
  });

  it('POST /api/stocks/:ticker/thesis generates 3-point investment thesis', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/stocks/BBAS3/thesis')
      .send({ forceRefresh: true })
      .expect(201);

    expect(typeof res.body.strengths).toBe('string');
    expect(typeof res.body.risks).toBe('string');
    expect(typeof res.body.verdict).toBe('string');
    expect(typeof res.body.businessCategory).toBe('string');
  });
});

