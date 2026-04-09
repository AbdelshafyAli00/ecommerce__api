import { Column, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CreateDateColumn } from "typeorm";
import { Role } from "./enums/role.enum";
import { Cart } from "src/cart/cart.entity";
import { Exclude } from "class-transformer";
@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id:number 
    
    @Column()
    name:string

    @Column({unique:true})
    email:string
    @Column()
     @Exclude()
    password:string
    @Column({type:'enum' ,enum:Role,default:Role.User})
    role:Role 
  
    @OneToOne(()=>Cart,(cart)=>cart.user)
    cart:Cart
    @CreateDateColumn() 
    createdAt:Date 
   
    @UpdateDateColumn()
    updatedAt :Date
   @Column({ type: 'text', nullable: true })
    @Exclude()
    resetToken: string | null;

   @Column({ type: 'timestamp', nullable: true })
    @Exclude()
   resetTokenExpired: Date | null;
}