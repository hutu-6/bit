import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  //初始化配置项DocumentBuilder
  const options = new DocumentBuilder().setTitle('这是文档标题').setDescription('这是一个描述').setVersion('版本').build()

  // 初始化SwaggerModule
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('/api-docs', app ,document)

  await app.listen(3000);
}
bootstrap();
