import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";


export class updateReviewDto{
    @IsOptional()
    @IsNumber()
    @ApiProperty({example:3})
    rating?:number 

    @IsOptional()
    @IsString()
    @ApiProperty({example:"Good"})
    comment?:string 
}