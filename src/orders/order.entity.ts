import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "./orderItem.entity";
import { OrderStatus } from "./enums/status.enum";


@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id:number 
    
    @ManyToOne(()=>User)
    user:User
   
    @OneToMany(()=>OrderItem ,(orderItem)=>orderItem.order)
    items:OrderItem[]

    @Column()
    totalPrice:number

    @Column({type:'enum' , enum:OrderStatus,default:OrderStatus.PENDING}) 
    status:OrderStatus

}