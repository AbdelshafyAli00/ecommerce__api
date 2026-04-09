import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cart } from "./cart.entity";
import { CartItems } from "./cartItems.entity";
import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";
import { Product } from "src/products/product.entity";

@Module({
    imports:[TypeOrmModule.forFeature([Cart,CartItems,Product])],
    providers:[CartService],
    controllers:[CartController]
    
})
export class CartModule {

}