import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { Repository, Equal } from 'typeorm';
import { Product } from 'src/products/product.entity';
import { CartItems } from './cartItems.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(CartItems)
    private readonly cartItemsRepository: Repository<CartItems>,
  ) {}

  async addToCart(userId: number, productId: number, quantity: number) {

    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations:["cartitems","cartitems.product","user"]
    });
    if (!cart) {
      cart = this.cartRepository.create({ user: { id: userId } });
      await this.cartRepository.save(cart);
    }
    let existingItem = cart.cartitems?.find(
      (item) => item.product.id == productId,
    );
    if (existingItem) {
      existingItem.quantity += quantity;
      return this.cartItemsRepository.save(existingItem);
    }

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
     if (quantity > product.stock) {
    throw new BadRequestException("Not enough stock");
  }
    const newItem = this.cartItemsRepository.create({
      cart,
      product,
      quantity,
    });
    await  this.cartItemsRepository.save(newItem);
    return newItem
  }

;
  async getCart(userId:number){
    const cart = await this.cartRepository.findOne({
      where:{user:{id:userId}} ,relations:["cartitems" ,"cartitems.product"]
    })
    if(!cart){
        throw new NotFoundException("cart not found")
    }

 const totalPrice = cart.cartitems.reduce((total, item) => {
      return total + item.quantity * item.product.price;
    }, 0);


    return {
      cart,
      totalPrice
    }

  }


   async updateQuantity(quantity:number,cartItemId:number){
     if (quantity <= 0) {
      throw new BadRequestException("Quantity must be greater than 0");
    }
    let cartItem = await this.cartItemsRepository.findOne({where:{id:cartItemId}, relations: ["product"]})
    if(!cartItem){
      throw new NotFoundException("cartItem not found")
    }

    if (quantity > cartItem.product.stock) {
      throw new BadRequestException("Not enough stock");
    }

    cartItem.quantity = quantity
    await this.cartItemsRepository.save(cartItem)
    return cartItem


  }


  async RemoveItemFromCart(userId:number ,itemId:number){
    const item = await this.cartItemsRepository.findOne({
      where:{id:itemId , cart:{user:{id:userId}}}})
    if(!item){
      throw new NotFoundException("item not found")
    }

    await this.cartItemsRepository.delete(itemId)
    return {message:"item deleted successfully"}
  }

 


  async clearCart(userId:number){
    const cart = await this.cartRepository.findOne({where:{user:{id:userId}}})
    if(!cart){
      throw new NotFoundException("cart not found")
    }
    await this.cartItemsRepository.delete({cart:{id:cart.id}})
    return {message:"cart deleted successfully"}

  }


}
