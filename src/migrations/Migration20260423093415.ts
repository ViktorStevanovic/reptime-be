import { Migration } from '@mikro-orm/migrations';

export class Migration20260423093415 extends Migration {
  override up(): void | Promise<void> {
    this.addSql(
      `create table "users" ("id" uuid not null default gen_random_uuid(), "name" varchar(255) not null, "surname" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), primary key ("id"));`,
    );
    this.addSql(
      `alter table "users" add constraint "users_email_unique" unique ("email");`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "users" cascade;`);
  }
}
