import { User } from "src/users/user.entity";
import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CartItems } from "./cartItems.entity";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id:number 
  
    @OneToOne(()=>User ,(user)=>user.cart)
    @JoinColumn()
    user:User  
   @OneToMany(()=>CartItems , (cartitems)=>cartitems.cart,{cascade:true})
    cartitems:CartItems[]

}