import { Controller, Get, HttpStatus, Param, Post, Query, Request } from '@nestjs/common';
import { AppService } from './app.service';


@Controller('user')
export class AppController {
  userService: any;
  petsService: any;
  constructor(private readonly appService: AppService) { }

  @Get('address')
  generateAddress() {
    const address = '1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX'; // 生成比特币地址逻辑
    return { address };
  }

  @Get('getaddress')
  getAddress() {
    return this.appService.getAddress();
  }

  @Get('getHD')
  getHD(){
    return this.appService.getHD();
  }

  @Get('getHDForCli')
  getHDForCli(){
    return this.appService.getHDForCli();
  }
  
  @Get('getHDForBip39')
  getHDForBip39(){
    return this.appService.getHDForBip39();
  }

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('var')
  create(@Request() req) {
    console.log(req.body);

    return {
      code: 200,
      message: req.body.name
    }

  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Get()
  findPets(@Query('limit') limit: number) {
    const pets = this.petsService.findPets(limit);
    return {
      statusCode: HttpStatus.OK,
      response: pets
    }
  }
}

