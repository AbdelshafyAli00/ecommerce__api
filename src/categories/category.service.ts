import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { Inject, NotFoundException } from '@nestjs/common';
import { updateCategoryDto } from './dtos/update-category.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
     @Inject(CACHE_MANAGER) 
        private readonly cacheManager:any
  ) {}

  async createCategory(dto: CreateCategoryDto,) {
    const category = this.categoryRepository.create(dto)
    const savedCategory = await this.categoryRepository.save(category)

      await this.cacheManager.clear();

       return savedCategory;
  }

  async getAllCategory(query:any) {
    const {page =1,limit=5} =query 


    const cachedKey = `categories:${page}:${limit}`  
    const cachedData = await this.cacheManager.get(cachedKey) 
    if(cachedData){
      console.log("from Cached")
      return cachedData
    }
    const categories = await this.categoryRepository.find({
      take:Number(limit) , skip:(Number(page-1)*Number(limit)) ,
      
    });
    await this.cacheManager.set(cachedKey,categories,60000) 
    console.log("from db")
    return categories
  }

  async getOneCategory(id: number) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`category with ${id} not found`);
    }
    return category;
  }

  async updateCategory(id: number, data: updateCategoryDto) {
  await this.getOneCategory(id);

  await this.categoryRepository.update(id, data);

  await this.cacheManager.clear();

  return this.getOneCategory(id);
}
  async deleteCategory(id:number){
    await this.categoryRepository.delete(id)
        await this.cacheManager.clear();
    return {message:"category was deleted successfully"}
  }
}
