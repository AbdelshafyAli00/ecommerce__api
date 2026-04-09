import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { ReviewService } from "./review.service";
import {  CreateReviewDto } from "./dtos/create-review.dto";
import { AuthGuard } from "@nestjs/passport";
import { updateReviewDto } from "./dtos/update-review.dto";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";


@Controller('api/reviews')
export class ReviewController {
  constructor(
    private readonly reviewService:ReviewService
  ){}

  @Post(':productId')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({summary:"Create review"})
  @ApiBody({type:CreateReviewDto})
  @ApiBearerAuth()
  @ApiResponse({status:200,description:"Review created"})
  createReview(
    @Body() data:CreateReviewDto ,
    @Param('productId' ,ParseIntPipe) productId:number ,
    @Req() req 
 ){
    return this.reviewService.createReview(data,productId,req.user.id)

  }

  @Get() 
  @ApiOperation({summary:"Get all reviews"})
  getAllReviews(){
    return this.reviewService.getAllReviews()
  }

  @Get(':productId')
   @ApiOperation({summary:"Get review by Id"})
  getProductReviews(@Param('productId', ParseIntPipe) productId:number){
    return this.reviewService.getProductReviews(productId)
  }

  @Get(':id/rating')
   @ApiOperation({summary:"Get rating with all reviews"})
  async getRating(@Param('id',ParseIntPipe) id: number) {
  return this.reviewService.getAverageRating(id);
}

  @Patch(':reviewId')
  @ApiOperation({summary:"update review"}) 
  @ApiBody({type:updateReviewDto})
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  updateReview(
      @Param('reviewId' ,ParseIntPipe) reviewId:number ,
      @Body() data:updateReviewDto ,
      @Req() req , 
  ){
      return this.reviewService.updateReview(reviewId,data,req.user.id)
  }

    @Delete(':reviewId')
     @ApiOperation({summary:"delete review"}) 
    @UseGuards(AuthGuard('jwt'))
    deleteReview(
      @Param('reviewId',ParseIntPipe) reviewId:number,
      @Req() req

    ){

      return this.reviewService.deleteReview(reviewId,req.user.id)

    }


    }
