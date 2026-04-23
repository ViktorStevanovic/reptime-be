import { Migration } from '@mikro-orm/migrations';

export class Migration20260423120928 extends Migration {
  override up(): void | Promise<void> {
    this.addSql(
      `create table "user_roles" ("id" uuid not null default gen_random_uuid(), "name" varchar(255) not null, "code" varchar(255) not null, primary key ("id"));`,
    );
    this.addSql(
      `alter table "user_roles" add constraint "user_roles_code_unique" unique ("code");`,
    );

    this.addSql(`alter table "users" add "role_id" uuid not null;`);
    this.addSql(
      `alter table "users" add constraint "users_role_id_foreign" foreign key ("role_id") references "user_roles" ("id");`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "users" drop constraint "users_role_id_foreign";`);

    this.addSql(`drop table if exists "user_roles" cascade;`);

    this.addSql(`alter table "users" drop column "role_id";`);
  }
}
