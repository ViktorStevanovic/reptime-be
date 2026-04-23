import { defineEntity, p } from '@mikro-orm/core';

const UserRoleSchema = defineEntity({
  name: 'UserRole',
  tableName: 'user_roles',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    name: p.string(),
    code: p.string().unique(),
  },
});

export class UserRole extends UserRoleSchema.class {}
UserRoleSchema.setClass(UserRole);
