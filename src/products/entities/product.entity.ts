import { v4 as uuidv4 } from 'uuid';
import { CreateProductDto } from '../dto/create-product.dto';
import { AttributeValue } from '@aws-sdk/client-dynamodb';
export class Product {
  id: string;
  name: string;
  price: number;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  static newInstanceFromDynamoDBObject(
    data: Record<string, AttributeValue>,
  ): Product {
    const result = new Product();
    result.name = data.name.S;
    result.id = data.id.S;
    result.price = parseFloat(data.price.N);
    result.createdAt = new Date(Number(data.createdAt.N));
    if (data.updatedAt) {
      result.updatedAt = new Date(Number(data.updatedAt.N));
    }
    if (data.status) {
      result.status = data?.status?.BOOL;
    }
    return result;
  }
  static newInstanceFromDTO(data: CreateProductDto) {
    const result = new Product();
    result.name = data.name;
    result.price = data.price;
    result.status = data.status ? data.status : true;
    result.id = uuidv4();
    result.createdAt = new Date();
    result.updatedAt = new Date();
    return result;
  }
}
