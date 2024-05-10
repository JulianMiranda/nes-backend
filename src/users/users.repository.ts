import { Injectable } from '@nestjs/common';
import {
  DynamoDBClient,
  ScanCommand,
  GetItemCommand,
  PutItemCommand,
  AttributeValue,
  DeleteItemCommand,
} from '@aws-sdk/client-dynamodb';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository {
  private readonly tbName = 'nes';
  private readonly client: DynamoDBClient;
  constructor() {
    this.client = new DynamoDBClient({
      region: 'us-east-1',
    });
  }

  async findAll() {
    const result: User[] = [];
    const command = new ScanCommand({
      TableName: this.tbName,
    });
    const response = await this.client.send(command);
    if (response.Items) {
      response.Items.forEach((item) => {
        result.push(User.newInstanceFromDynamoDBObject(item));
      });
    }
    return result;
  }
  async findByUserId(userId: string) {
    const command = new GetItemCommand({
      TableName: this.tbName,
      Key: {
        id: { S: userId },
      },
    });

    const request = await this.client.send(command);
    if (!request.Item) {
      throw new Error('Usuario no encontrado');
    }
    if (request.Item) {
      return User.newInstanceFromDynamoDBObject(request.Item);
    }
  }
  async findOneByEmail({ email }: { email: string }) {
    const input = {
      ExpressionAttributeValues: {
        ':a': {
          S: email,
        },
      },
      FilterExpression: 'email = :a',
      TableName: this.tbName,
    };
    const command = new ScanCommand(input);

    try {
      const request = await this.client.send(command);
      if (request.Count > 0) {
        return User.newInstanceFromDynamoDBObject(request.Items[0]);
      }
    } catch (error) {
      console.log('Error', error);
    }
  }

  async upsertOne(data: User) {
    const itemObject: Record<string, AttributeValue> = {
      id: {
        S: data.id,
      },
      name: {
        S: data.name,
      },
      email: {
        S: data.email,
      },
      password: {
        S: data.password,
      },
      createdAt: {
        N: String(data.createdAt.getTime()),
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

  async deleteByUserId(userId: string) {
    const command = new DeleteItemCommand({
      TableName: this.tbName,
      Key: {
        id: { S: userId },
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
