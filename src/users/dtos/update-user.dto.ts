import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional } from "class-validator";


export class UpdateUserDto {
    @IsOptional()
    @ApiProperty({required:false})
    name:string
    @IsOptional()
    @IsEmail()
    @ApiProperty({required:false})
    email:string 
    @IsOptional()
    @ApiProperty({required:false})
    password:string 
}