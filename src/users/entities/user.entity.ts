import { CreateUserDto } from '../dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';

export class User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;

  static newInstanceFromDynamoDBObject(data: any): User {
    const result = new User();
    result.name = data.name.S;
    result.id = data.id.S;
    result.email = data.email.S;
    result.password = data.password.S;
    result.createdAt = new Date(Number(data.createdAt.N));
    if (data.updatedAt) {
      result.updatedAt = new Date(Number(data.updatedAt.N));
    }
    return result;
  }
  static newInstanceFromDTO(data: CreateUserDto) {
    const result = new User();
    result.name = data.name;
    result.email = data.email;
    result.password = data.password;
    result.id = uuidv4();
    result.createdAt = new Date();
    return result;
  }
}
