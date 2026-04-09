import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";


export class AddToCartDto {
    @IsNumber()
    @ApiProperty({example:1})
    productId:number
    
    @IsNumber()
    @ApiProperty({example:3})
    quantity:number
}