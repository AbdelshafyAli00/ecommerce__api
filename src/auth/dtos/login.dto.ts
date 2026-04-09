import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, MinLength } from "class-validator"


export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({example:"abdelshafya5@gmail.com"})
    email:string 
    @MinLength(8)
    @ApiProperty({example:"abdelshafy1234"})
    password:string 
}