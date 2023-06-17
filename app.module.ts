import { INestApplication, MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';

@Module({
  controllers: [AppController],
  providers: [AppService],
  
})


export class AppModule {
  app: Promise<INestApplication>;
    async configure(consumer: MiddlewareConsumer) {
        // 设置 Swagger 
        const app = await NestFactory.create(AppModule);
        const options = new DocumentBuilder()
          .setTitle('Bitcoin example')
          .setDescription('Generate bitcoin addresses')
          .setVersion('1.0')
          .build();
        const document = SwaggerModule.createDocument(app, options);
        SwaggerModule.setup('swagger', app, document);
      }
}

export class FindPetsByTagsDto{
  tags: string[];
}


declare module 'bitcoinjs-lib' {
  export class ECPair {
    static makeRandom: any;
    // ...
  }
}
