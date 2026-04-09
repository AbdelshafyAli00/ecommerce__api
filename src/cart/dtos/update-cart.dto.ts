import { ApiProperty } from "@nestjs/swagger";
import { IsNumber} from "class-validator";


export class UpdateCartDto{
    @IsNumber()
    @ApiProperty({example:4})
    quantity:number
}