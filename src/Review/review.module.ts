import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { Product } from 'src/products/product.entity';

@Module({
    imports:[TypeOrmModule.forFeature([Review,Product])] ,
    controllers:[ReviewController] ,
    providers:[ReviewService]
})
export class ReviewModule {}
