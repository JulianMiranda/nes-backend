import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.upsertOne(
      User.newInstanceFromDTO(createUserDto),
    );
  }

  findAll() {
    return this.userRepository.findAll();
  }

  findOne(id: string) {
    return this.userRepository.findByUserId(id);
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOneByEmail({ email });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const existingObject = await this.userRepository.findByUserId(id);
    if (updateUserDto.name) {
      existingObject.name = updateUserDto.name;
    }

    existingObject.updatedAt = new Date();

    return this.userRepository.upsertOne(existingObject);
  }

  remove(id: string) {
    return this.userRepository.deleteByUserId(id);
  }
}
