import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CreateReviewDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({example:5})
    rating:number
     @IsString()
    @IsNotEmpty()
    @ApiProperty({example:"Excellent"})
   comment: string;

}