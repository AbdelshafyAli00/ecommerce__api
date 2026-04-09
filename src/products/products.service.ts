import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
import { updateProductDto } from './dtos/update-product.dto';
import { Category } from 'src/categories/category.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @Inject(CACHE_MANAGER) 
    private readonly cacheManager:any
  ) {}

  async createProduct(data: CreateProductDto) {
    const category = await this.categoryRepository.findOne({
      where: { id: data.categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    const product = this.productRepository.create({ ...data, category }); 
    
      const savedProduct =  await this.productRepository.save(product);
      await this.cacheManager.clear() 
      return savedProduct;
  }

  async getAllProducts(query: any) {
    const { page = 1, limit = 10, sort = 'createdAt' ,categoryId } = query;
    const allowedSorted =["price" ,"title" ,"stock" ,"description","createdAt"]
    const sortField = allowedSorted.includes(sort)?sort:"createdAt"
    
    const cachedKey = `products:${page}:${limit}:${sortField}:${categoryId||"all"}`
    const cachedData =  await this.cacheManager.get(cachedKey) 
    if(cachedData){
      return cachedData
    }

    const products =  await this.productRepository.find({
     where:categoryId ?{category:{id:Number(categoryId)}}:{},
      take: Number(limit),
      skip:Number((page-1))*Number(limit),
      order:{[sortField]:"ASC"},
      relations: ['category'],
    });

    await this.cacheManager.set(cachedKey,products,60000) 
    return products
  }

  async getProduct(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('product not found');
    }
    return product;
  }

  async updateProduct(id: number, data: updateProductDto) {
    await this.getProduct(id);
    await this.productRepository.update(id, data);
    await this.cacheManager.clear()
    return await this.getProduct(id);
  }


   async updateImages(id: number, files: Express.Multer.File[]) {

   const product = await this.productRepository.findOne({
    where: { id },
  });

  if (!product) {
    throw new NotFoundException('product not found');
  }

  const newImages = files.map(file => file.filename);

     product.images = newImages;

   const updatedProduct = await this.productRepository.save(product);
   await this.cacheManager.clear() 
   return updatedProduct
}


  async deleteProduct(id: number) {
    await this.getProduct(id);
    await this.productRepository.delete(id);
    await this.cacheManager.clear()
    return { message: 'product deleted successfully' };
  }
}
