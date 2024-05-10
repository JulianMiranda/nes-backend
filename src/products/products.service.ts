import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './products.repository';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(private readonly productRepository: ProductsRepository) {}

  create(createProductDto: CreateProductDto) {
    return this.productRepository.upsertOne(
      Product.newInstanceFromDTO(createProductDto),
    );
  }

  findAll() {
    return this.productRepository.findAll();
  }

  findOne(id: string) {
    return this.productRepository.findByProductId(id);
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const existingObject = await this.productRepository.findByProductId(id);
    if (updateProductDto.name) {
      existingObject.name = updateProductDto.name;
    }

    existingObject.updatedAt = new Date();

    return this.productRepository.upsertOne(existingObject);
  }

  remove(id: string) {
    return this.productRepository.deleteByProductId(id);
  }
}
