import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @ApiProperty()
  title: string;
  @IsString()
   @ApiProperty()
  description: string;
  @Type(()=>Number)
  @IsNumber()
  @ApiProperty()
  price: number;
  @IsString()
  @IsOptional()

  images?: string[];
  @IsNumber()
   @ApiProperty()
  @Type(()=>Number)
  stock: number;
   @ApiProperty()
   @IsNumber()
  @Type(()=>Number)
  categoryId:number; 
}
