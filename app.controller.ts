import { Controller, Get, HttpStatus, Param, Post, Query, Request } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('user')
export class AppController {
  userService: any;
  petsService: any;
  constructor(private readonly appService: AppService) { }

  @Get('getaddress')
  getAddress() {
    return this.appService.getAddress();
  }

  @Get('getHD')
  getHD(index: number){
    return this.appService.getHD(index);
  }

  @Get('getHDForCli')
  getHDForCli() {
    return this.appService.getHDForCli();
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
