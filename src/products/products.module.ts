import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./product.entity";
import { ProductService } from "./products.service";
import { ProductController } from "./products.controller";
import { Category } from "src/categories/category.entity";


@Module({
    imports:[TypeOrmModule.forFeature([Product,Category])] ,
    providers:[ProductService] ,
    controllers:[ProductController]
})
export class ProductModule {

}