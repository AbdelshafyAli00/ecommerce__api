import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '@nestjs/passport';
import { AddToCartDto } from './dtos/add-to-cart.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UpdateCartDto } from './dtos/update-cart.dto';

@Controller('api/cart')
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('/add')
  @ApiOperation({summary:"Add product to cart"})
  @ApiBody({type:AddToCartDto})
  @ApiResponse({status:200,description:"Product addes to cart successfully"})
  @UseGuards(AuthGuard('jwt'))
  addToCart(@Req() req, @Body() body: AddToCartDto) {
    const userId = req.user.id;
    return this.cartService.addToCart(userId, body.productId, body.quantity);
  }

  @Get()
  @ApiOperation({summary:"Get user cart"})
  @ApiResponse({status:200,description:"user cart recieved successfully"})
  @UseGuards(AuthGuard('jwt'))
  getCart(@Req() req) {
    return this.cartService.getCart(req.user.id);
  }

  @Patch('item/:cartItemId')
  @ApiOperation({summary:"Update cart item quantity"})
  @ApiParam({name:"cartItemId",example:1})
  @ApiResponse({status:200,description:"Cart item updated successfully"})
  @ApiBody({type:UpdateCartDto})
  
  @UseGuards(AuthGuard('jwt'))
  updateQuantity(
    @Param('cartItemId', ParseIntPipe) cartItemId: number,
    @Body('quantity', ParseIntPipe) quantity: number,
  ) {
    return this.cartService.updateQuantity(quantity, cartItemId);
  }

  @Delete('item/:cartItemId')
  @ApiOperation({summary:"Delete item from cart "})
  @ApiParam({name:"cartItemId",example:2})
  @ApiResponse({status:200,description:"item deleted successfully"})
  @UseGuards(AuthGuard('jwt'))
  RemoveItemFromCart(@Req() req, @Param('cartItemId', new ParseIntPipe()) id: number) {
    return this.cartService.RemoveItemFromCart(req.user.id, id);
  }

  @Delete()
  @ApiOperation({summary:"Clear cart"})
  @ApiResponse({status:200 ,description:"Cart deleted successfully"})
  @UseGuards(AuthGuard('jwt'))
  deleteCart(@Req() req ){
    return this.cartService.clearCart(req.user.id)

  }
}
