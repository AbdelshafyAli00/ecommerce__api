import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./cart.entity";
import { Product } from "src/products/product.entity";

@Entity()
export class CartItems {
   @PrimaryGeneratedColumn()
   id:number 

   @Column()
   quantity:number 
   
   @ManyToOne(()=>Cart ,(cart)=>cart.cartitems)
   cart:Cart
  
   @ManyToOne(()=>Product ,(product)=>product.cartitems)
   product:Product
}