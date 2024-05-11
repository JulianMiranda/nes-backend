import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateProductDto } from 'src/products/dto/create-product.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

const checkProps = (props: string[], dataKeys: string[]) => {
  for (const key of dataKeys) {
    if (!props.includes(key)) {
      throw new BadRequestException(`The property \\ ${key} \\ is not valid`);
    }
  }
};

const checkUsersProps = (
  data: Partial<CreateUserDto>,
): Partial<CreateUserDto> => {
  const props = [
    'name',
    'email',
    'password',
    'status',
    'createdAt',
    'updatedAt',
    'role',
  ];

  checkProps(props, Object.keys(data));
  return data;
};
const checkProductsProps = (
  data: Partial<CreateProductDto>,
): Partial<CreateProductDto> => {
  const props = ['name', 'price', 'status', 'createdAt', 'updatedAt'];

  checkProps(props, Object.keys(data));
  return data;
};
export const acceptedProps = (route: string, data: any): any => {
  if (route === 'users') return checkUsersProps(data);
  if (route === 'products') return checkProductsProps(data);
  throw new InternalServerErrorException('Invalid Route');
};
