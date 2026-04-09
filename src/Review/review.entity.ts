import { Product } from "src/products/product.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";


@Entity()
@Unique(["user", "product"])
export class Review {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({type:'decimal' ,default:0})
  rating: number;

  @Column()
  comment: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Product, (product) => product.id ,{onDelete:'CASCADE'})
  product: Product;
}