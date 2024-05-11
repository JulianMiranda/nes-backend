import { Injectable } from '@nestjs/common';
import { ROLES } from './roles.enum';

@Injectable()
export class RoleRepository {
  constructor() {}

  getRoles(): any {
    return {
      [ROLES.ADMIN]: [ROLES.ADMIN, ROLES.CLIENT],
      [ROLES.CLIENT]: [ROLES.CLIENT],
    };
  }
}
