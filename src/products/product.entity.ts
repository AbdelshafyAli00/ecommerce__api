import { CartItems } from "src/cart/cartItems.entity";
import { Category } from "src/categories/category.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id:number 
    @Column()
    title:string 
    @Column()
    description:string 
    @Column()
    price:number
    @Column({default:0})
    stock:number 
    @Column("simple-array",{nullable:true})
    images:string[]
    @ManyToOne(()=>Category,(category)=>category.products)
    category:Category
    @OneToMany(()=>CartItems ,(cartitems)=>cartitems.cart)
    cartitems:CartItems
    @CreateDateColumn()
    createdAt:Date 
    @UpdateDateColumn()
    updatedAt:Date 
}