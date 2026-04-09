import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty,  IsString, MinLength } from "class-validator"


export class resetPasswordDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    token:string
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @ApiProperty({example:'12345678'})
    newPassword:string
}