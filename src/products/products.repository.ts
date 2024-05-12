import { Injectable, NotFoundException } from '@nestjs/common';
import {
  DynamoDBClient,
  ScanCommand,
  GetItemCommand,
  PutItemCommand,
  AttributeValue,
  DeleteItemCommand,
} from '@aws-sdk/client-dynamodb';
import { Product } from './entities/product.entity';
import { AWS_REG } from 'src/config/config';

@Injectable()
export class ProductsRepository {
  private readonly tbName = 'products';
  private readonly client: DynamoDBClient;
  constructor() {
    this.client = new DynamoDBClient({
      region: AWS_REG,
    });
  }

  async findAll() {
    const result: Product[] = [];
    const command = new ScanCommand({
      TableName: this.tbName,
    });
    const response = await this.client.send(command);

    if (response.Items) {
      response.Items.forEach((item) => {
        result.push(Product.newInstanceFromDynamoDBObject(item));
      });
    }
    return { total: response.Count, data: result };
  }

  async findByProductId(productId: string) {
    const command = new GetItemCommand({
      TableName: this.tbName,
      Key: {
        id: { S: productId },
      },
    });
    const request = await this.client.send(command);
    if (!request.Item)
      throw new NotFoundException(
        `Could not find product for id: ${productId}`,
      );

    if (request.Item) {
      return Product.newInstanceFromDynamoDBObject(request.Item);
    }
  }

  async upsertOne(data: Product) {
    const itemObject: Record<string, AttributeValue> = {
      id: {
        S: data.id,
      },
      name: {
        S: data.name,
      },
      price: {
        N: data.price.toString(),
      },
      createdAt: {
        N: String(data.createdAt.getTime()),
      },
      status: {
        BOOL: data.status,
      },
    };
    if (data.updatedAt) {
      itemObject.updatedAt = {
        N: String(data.updatedAt.getTime()),
      };
    }
    const command = new PutItemCommand({
      TableName: this.tbName,
      Item: itemObject,
    });
    await this.client.send(command);
    return data;
  }

  async deleteByProductId(productId: string) {
    const command = new DeleteItemCommand({
      TableName: this.tbName,
      Key: {
        id: { S: productId },
      },
      ReturnConsumedCapacity: 'TOTAL',
      ReturnValues: 'ALL_OLD',
    });
    const request = await this.client.send(command);
    if (request.Attributes) {
      return true;
    }
    return false;
  }
}
