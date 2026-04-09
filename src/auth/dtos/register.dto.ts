import { ApiProperty } from "@nestjs/swagger"
import { Exclude } from "class-transformer"
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"
import { Role } from "src/users/enums/role.enum"


export class RegisterDto {
    @IsString()
    @ApiProperty({example:'Abdelshafy'})
    name:string 
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({example:'abdelshafy00@gmail.com'})
    email:string 
    @MinLength(8)
    @ApiProperty({example:'12345678'})
   
    password :string
    role:Role

}