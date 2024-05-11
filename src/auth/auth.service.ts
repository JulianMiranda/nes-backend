import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';

import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { ROLES } from 'src/role/roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register({ password, email, name }: RegisterDto) {
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      throw new BadRequestException('Email already exists');
    }
    const hashedPassword = await bcryptjs.hash(password, 10);

    const userSaved = await this.usersService.create({
      name,
      email,
      password: hashedPassword,
      status: true,
      role: ROLES.CLIENT,
    });
    const payload = {
      email: userSaved.email,
      id: userSaved.id,
      role: userSaved.role,
    };
    const token = await this.jwtService.signAsync(payload);
    return {
      token: token,
      email: userSaved.email,
      message: 'User created successfully',
    };
  }

  async login({ email, password }: LoginDto) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    const payload = { email: user.email, id: user.id, role: user.role };
    const token = await this.jwtService.signAsync(payload);
    return {
      token: token,
      email: user.email,
    };
  }
}
