import {config} from "dotenv"
import { Cart } from "src/cart/cart.entity";
import { CartItems } from "src/cart/cartItems.entity";
import { Category } from "src/categories/category.entity";
import { Order } from "src/orders/order.entity";
import { OrderItem } from "src/orders/orderItem.entity";
import { Product } from "src/products/product.entity";
import { Review } from "src/Review/review.entity";
import { User } from "src/users/user.entity";
import { DataSource,DataSourceOptions } from "typeorm";


config({path:'.env'})
export const dataSourceOptions:DataSourceOptions = {
    type:'postgres' ,
    url:process.env.DB_URL,
      ssl: {
     rejectUnauthorized: false,
  },
    entities:[User,Product,Category,Review,Cart,CartItems,Order,OrderItem],
    migrations:["dist/db/migrations/*.js"]
}

export const dataSource = new DataSource(dataSourceOptions)
