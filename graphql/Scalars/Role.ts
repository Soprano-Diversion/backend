import { enumType } from 'nexus';

export const RoleType = enumType({
  name: 'RoleType',
  members: ['ADMIN', 'USER'],
  asNexusMethod: 'role',
});
