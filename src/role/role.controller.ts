import { Controller, Get, UseGuards } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller()
@UseGuards(AuthGuard)
export class RoleController {
  constructor(private roleRepository: RoleRepository) {}

  @Get('/getRoles')
  getRoles(): Promise<any> {
    return this.roleRepository.getRoles();
  }
}
