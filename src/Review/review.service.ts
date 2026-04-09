import { InjectRepository } from "@nestjs/typeorm";
import { Review } from "./review.entity";
import { Repository } from "typeorm";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { CreateReviewDto } from "./dtos/create-review.dto";
import { Product } from "src/products/product.entity";
import { updateReviewDto } from "./dtos/update-review.dto";



export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository:Repository<Review>,
        @InjectRepository(Product)
        private readonly productRepository:Repository<Review>
    ){}

    async createReview(data:CreateReviewDto,productId:number,userId:number){
        const product = await this.productRepository.findOne({where:{id:productId}})
        if(!product){
        throw new NotFoundException("Product not found");
        }

        const review = this.reviewRepository.create({
            ...data ,product:{id:productId},user:{id:userId}
        })  
        return await this.reviewRepository.save(review)
    }

    async getAllReviews(){
        return await this.reviewRepository.find({relations:["user" ,"product"]})
    }

    async getProductReviews(productId:number){
        const review = await this.reviewRepository.findOne({
            where:{product:{id:productId}},relations:["user" ,"product"]
        })

        if(!review){
            throw new NotFoundException("Review not found")
        }
        return review 
    }

    async getAverageRating(productId:number){
        const reviews = await this.reviewRepository.find({where:{product:{id:productId}}})
        if(reviews.length==0) return 0

        const total = reviews.reduce((sum,rev)=>sum+rev.rating,0)  
        return {avgRating :total /reviews.length}

    }

    async updateReview (reviewId:number,data:updateReviewDto,userId:number){
        const review = await this.reviewRepository.findOne({where:{id:reviewId},relations:["user"]})
        if(!review){
            throw new NotFoundException("review not found")
        }  

        if(review.user.id != userId){
          throw new ForbiddenException("You can only update your own review");
        }

         await this.reviewRepository.update(reviewId,data)
          return await this.reviewRepository.findOne({
        where: { id: reviewId },relations:["user"]
    });
      

       
    }

    async deleteReview(reviewId:number,userId:number){
        const review = await this.reviewRepository.findOne({where:{id:reviewId},relations:["user"]})
         if(!review){
            throw new NotFoundException("review not found")
        }  

        if(review.user.id != userId){
           throw new ForbiddenException("You can only update your own review")
        }

        await this.reviewRepository.delete(reviewId)
         return { message: "Review deleted successfully" }
    }
}