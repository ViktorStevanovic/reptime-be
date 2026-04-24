import { defineEntity, p } from '@mikro-orm/core';
import { UserRole } from '../user-roles/user-role.entity';

const UserSchema = defineEntity({
  name: 'User',
  tableName: 'users',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    name: p.string(),
    surname: p.string(),
    email: p.string().unique(),
    password: p.string().hidden(),
    hashedRefreshToken: p.string().nullable().hidden(),
    role: p.manyToOne(UserRole),
    createdAt: p.datetime().defaultRaw('now()'),
    updatedAt: p
      .datetime()
      .defaultRaw('now()')
      .onUpdate(() => new Date()),
  },
});

export class User extends UserSchema.class {}
UserSchema.setClass(User);
