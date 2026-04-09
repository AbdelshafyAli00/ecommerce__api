import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { OrderService } from "./order.service";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/auth/auth.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { OrderStatus } from "./enums/status.enum";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";

@Controller('api/orders')
@ApiBearerAuth()
export class orderController {
  constructor(
    
    private readonly orderService :OrderService
  ){}

  @Post()
  @ApiOperation({summary:"Create new order from cart"})
  @ApiResponse({status:200,description:"Order created successfully"})
  @UseGuards(AuthGuard('jwt'))
  createOrder(@Req() req){
    return this.orderService.createOrder(req.user.id)

  }

  @Get()
  @ApiOperation({summary:"Get orders for user"})
   @ApiResponse({status:200,description:"Order retrieved successfully"})
  @UseGuards(AuthGuard('jwt'))
  getOrder(@Req() req){
    return this.orderService.getOrder(req.user.id)

  }

  @Get(':id')
   @ApiOperation({summary:"Get single order by Id"})
   @ApiParam({name:'id',example:1})
   @ApiResponse({status:200,description:"Order retrieved successfully"})
  @UseGuards(AuthGuard('jwt'))
  getSingleOrder(@Req() req , @Param('id', ParseIntPipe) id:number){
    return this.orderService.getSingleOrder( id,req.user.id)
  }

  @Patch(':id/status')
  @ApiOperation({summary:"Update status for order"})
  @ApiParam({name:"id",example:1})
  @ApiBody({schema:{example:{status:"paid"}}})
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'))
  updateStatus(@Param('id' ,ParseIntPipe) id:number ,@Body('status') status:OrderStatus){
     return this.orderService.updateStatus(id, status);

  }
}