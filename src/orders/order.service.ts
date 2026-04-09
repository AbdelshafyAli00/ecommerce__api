import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { Order } from './order.entity';
import { OrderItem } from './orderItem.entity';
import { Cart } from 'src/cart/cart.entity';
import { CartItems } from 'src/cart/cartItems.entity';
import { Product } from 'src/products/product.entity';
import { OrderStatus } from './enums/status.enum';

export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,

    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async createOrder(userId: number) {
    return await this.dataSource.transaction(async (manager) => {
      const cart = await manager.findOne(Cart, {
        where: { user: { id: userId } },
        relations: ['cartitems', 'cartitems.product'],
      });

      if (!cart || cart.cartitems.length === 0) {
        throw new BadRequestException('Cart is empty');
      }

      let totalPrice = 0;

      for (const item of cart.cartitems) {
        totalPrice += item.quantity * item.product.price;
      }

      const savedOrder = await manager.save(
        manager.create(Order, {
          user:{id:userId},
          totalPrice,
          status: OrderStatus.PENDING,
        }),
      );

      for (const item of cart.cartitems) {
        const product = await manager.findOne(Product, {
          where: { id: item.product.id },
          lock: { mode: 'pessimistic_write' },
        });

        if (!product || product.stock < item.quantity) {
          throw new BadRequestException(
            `Product ${item.product.title} out of stock`,
          );
        }

        await manager.save(
          manager.create(OrderItem, {
            order: savedOrder,
            product: product,
            quantity: item.quantity,
            price: product.price,
          }),
        );

        product.stock -= item.quantity;
        await manager.save(product);
      }

      await manager.delete(CartItems, { cart: { id: cart.id } });

      return savedOrder;
    });
  }

  async getOrder(userId: number) {
    const order =  await this.orderRepo.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });  

    return order
  }

  async getSingleOrder(orderId: number, userId: number) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId, user: { id: userId } },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateStatus(orderId:number,status:OrderStatus){
    const order = await this.orderRepo.findOne({where:{id:orderId}})
   if (!order) {
    throw new NotFoundException("Order not found");
  }

  order.status = status
  await this.orderRepo.save(order)
  return order
  }
}
