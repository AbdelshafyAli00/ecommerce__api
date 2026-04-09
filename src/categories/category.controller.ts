import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { updateCategoryDto } from './dtos/update-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multer.config';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/auth.guard';

@Controller('/api/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({summary:"Create new category"})
  @ApiBearerAuth()
  @ApiBody({schema:{
   type:'object' ,
   properties:{
    name:{type:'string'} ,
    image:{type:'string',format:'binary'}
   }
  }})
  @UseInterceptors(FileInterceptor('image', multerOptions('category')))
  createCategory(
    @Body() body: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File, @Req() req
  ) {
    if (file) {
      body.image = file.filename;
    }
    return this.categoryService.createCategory(body);
  }

  @Get() 
  @ApiOperation({summary:"Get all categories"})
  getAllCategory(@Query() query) {
    return this.categoryService.getAllCategory(query);
  }

  @Get(':id')
   @ApiOperation({summary:"Get category by Id"})
   @ApiParam({name:"id" ,example:1})
  getOneCategory(@Param('id', new ParseIntPipe()) id: number) {
    return this.categoryService.getOneCategory(id);
  }

  @Patch(':id')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @ApiParam({name:"id" ,example:1})
  @ApiOperation({summary:"Update category"})
  @ApiBearerAuth()
  @ApiBody({type:updateCategoryDto})
  updayeCategory(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() body: updateCategoryDto,
  ) {
    return this.categoryService.updateCategory(id, body);
  }

  @Delete(':id')
  @ApiOperation({summary:"Delete category"})
  @ApiBearerAuth()
  @ApiParam({name:"id" ,example:1})
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'),RolesGuard)

  deleteCategory(@Param('id', new ParseIntPipe()) id: number) {
    return this.categoryService.deleteCategory(id);
  }
}
