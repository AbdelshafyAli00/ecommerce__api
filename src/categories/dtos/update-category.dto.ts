import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class updateCategoryDto{
    @IsString()
    @ApiProperty({example:"Apple"})
    name:string
    
}