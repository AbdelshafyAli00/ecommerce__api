import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderItem } from "./orderItem.entity";
import { Order } from "./order.entity";
import { orderController } from "./order.controller";
import { OrderService } from "./order.service";



@Module({
    imports:[TypeOrmModule.forFeature([OrderItem,Order])],
    controllers:[orderController] ,
    providers:[OrderService]

})
export class OrderModule{

}