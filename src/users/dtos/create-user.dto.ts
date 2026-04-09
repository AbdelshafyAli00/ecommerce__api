import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"


export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example:"abdelshafy"})
    name:string 
    @IsEmail()
    @ApiProperty({example:"abdelshafy100@gmail.com"})
    email:string 
    @MinLength(8)
    @ApiProperty({example:"12345678"})
    password:string 
}