import { Product } from "src/products/product.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id:number 
   @Column()
  name:string
  @Column({nullable:true})
  image:string

  @OneToMany(()=>Product,(product)=>product.category)
  products:Product[]
}