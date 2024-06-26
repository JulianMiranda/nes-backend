import { IsString, IsBoolean } from 'class-validator';
export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsBoolean()
  status?: boolean;

  @IsString()
  role: string;
}
