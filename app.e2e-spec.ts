import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AppService } from "../src/app.service";

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/getaddress')
      .expect(200)
      .expect((res) => {
        expect(res.text).toMatch(/^[13][a-km-zA-HJ-NP-Z0-9]{25,34}$/);
      });
  });
});

describe('AppService', () => {
  let appService: AppService;

  beforeEach(() => {
    appService = new AppService();
  });

  it('should generate mnemonic and address', () => {
    const result = appService.getHD(0);
    expect(result).toBeDefined();
  });

  it('should generate different addresses for different indexes', () => {
    const result1 = appService.getHD(0);
    const result2 = appService.getHD(1);
    expect(result1).not.toEqual(result2);
  });
});
