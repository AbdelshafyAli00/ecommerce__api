import {  ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";


export class updateProductDto {
    @IsOptional()
    @ApiPropertyOptional({required:false})
    title?:string  
    @IsOptional()
    @ApiPropertyOptional({required:false})
    description?:string
    @IsOptional()
    @ApiPropertyOptional({required:false})
    stock?:number 
    @IsOptional()
    @ApiPropertyOptional({required:false})
    price?:number 
   



}