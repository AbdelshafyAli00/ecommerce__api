import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class ForgetPasswordDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({example:"abdelshafy22@gmail.com"})
    email:string 
}