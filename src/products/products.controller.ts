import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFiles, UseGuards, UseInterceptors, ValidationPipe } from "@nestjs/common";
import { ProductService } from "./products.service";
import { CreateProductDto } from "./dtos/create-product.dto";
import { updateProductDto } from "./dtos/update-product.dto";
import { FilesInterceptor } from "@nestjs/platform-express";
import { multerOptions } from "src/config/multer.config";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/auth/auth.guard";
import { Roles } from "src/auth/decorators/roles.decorator";

@ApiTags("Products")
@Controller('/api/products')
export class ProductController {
    constructor(
        private readonly productService:ProductService
    ){}
    
    @Post()
    @Roles('admin')
    @UseGuards(AuthGuard('jwt'),RolesGuard)
    @ApiOperation({summary:"Create product"})
    @ApiConsumes('multipart/form-data')
     @ApiBearerAuth()
    @ApiBody({
        schema:{
            type:'object' ,
            properties:{
                title:{type:'string'} ,
                description:{type:'string'} ,
                price:{type:'number'} ,
                stock:{type:'number'} ,
                categoryId:{type:"number"} ,
                images:{
                    type:'string' ,
                    format:'binary'
                }

            }
        }
    })
    @UseInterceptors(FilesInterceptor('images' ,5,multerOptions('products')))
    createProduct(@Body() body:CreateProductDto ,
     @UploadedFiles() files:Express.Multer.File[]){
        if(files){
            body.images = files.map((file)=>file.filename)
        } 
        return this.productService.createProduct(body)

    }

    @Get()
    @ApiOperation({summary:"Get all products "})
    @ApiQuery({name:'page' ,required:false ,example:1})
    @ApiQuery({name:'limit' ,required:false ,example:5})
    getAllProducts(@Query() query){
        return this.productService.getAllProducts(query)
    }
    
    @Get(':id')
     @ApiOperation({summary:"Get product by Id"})
     @ApiParam({name:'id',example:1}) 
     @ApiResponse({status:200,description:"product retrieved successfully"})
     @ApiResponse({status:404,description:"product not found"})
    getProduct(@Param('id', new ParseIntPipe()) id: number){
        return this.productService.getProduct(id)

    }
    @Patch(':id')
    @Roles('admin')
    @UseGuards(AuthGuard('jwt'),RolesGuard)
    @ApiOperation({summary:"Update product"})
    @ApiParam({name:'id',example:1})
    @ApiConsumes('application/json')
    @ApiBody({ type: updateProductDto })
    @ApiBearerAuth()
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: updateProductDto,
) {
    
  return this.productService.updateProduct(id, body);
}


@Patch(':id/images')
@Roles('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiOperation({summary:"Update product images"})
@ApiBearerAuth()
@ApiConsumes('multipart/form-data')
@ApiBody({
    schema:{
        type:'object' ,
        properties:{
            images:{
                type:'array' ,
                items:{type:'string' ,format:'binary'}

            },
            
        }
    }
})
@UseInterceptors(FilesInterceptor('images' ,5,multerOptions('products')))
updateProductImages(
  @Param('id', ParseIntPipe) id: number,
  @UploadedFiles() files: Express.Multer.File[],
) {
  return this.productService.updateImages(id, files);
}

    @Delete(':id')
    @ApiOperation({summary:"Delete product"})
    @ApiParam({name:'id',example:1})
    @ApiResponse({status:200,description:"product deleted successfully"})
    @ApiResponse({status:404,description:"product not found"})
    deleteProduct(@Param('id' ,new ValidationPipe()) id:number){
       return this.productService.deleteProduct(id)

    }

}