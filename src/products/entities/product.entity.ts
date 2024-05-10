import { v4 as uuidv4 } from 'uuid';
import { CreateProductDto } from '../dto/create-product.dto';
export class Product {
  id: string;
  name: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;

  static newInstanceFromDynamoDBObject(data: any): Product {
    const result = new Product();
    result.name = data.name.S;
    result.id = data.id.S;
    result.price = parseFloat(data.price.N);
    result.createdAt = new Date(Number(data.createdAt.N));
    if (data.updatedAt) {
      result.updatedAt = new Date(Number(data.updatedAt.N));
    }
    return result;
  }
  static newInstanceFromDTO(data: CreateProductDto) {
    const result = new Product();
    result.name = data.name;
    result.price = data.price;
    result.id = uuidv4();
    result.createdAt = new Date();
    return result;
  }
}
