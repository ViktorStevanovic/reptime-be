import { defineEntity, p } from '@mikro-orm/core';

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
    createdAt: p.datetime().defaultRaw('now()'),
    updatedAt: p.datetime().defaultRaw('now()'),
  },
});

export class User extends UserSchema.class {}
UserSchema.setClass(User);
