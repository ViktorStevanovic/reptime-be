import { Migration } from '@mikro-orm/migrations';

export class Migration20260424110149 extends Migration {
  override up(): void | Promise<void> {
    this.addSql(
      `create table "trainers" ("id" uuid not null default gen_random_uuid(), "user_id" uuid not null, "created_by_id" uuid not null, "bio" text null, "specialization" varchar(255) null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), primary key ("id"));`,
    );
    this.addSql(
      `alter table "trainers" add constraint "trainers_user_id_unique" unique ("user_id");`,
    );

    this.addSql(
      `create table "clients" ("id" uuid not null default gen_random_uuid(), "user_id" uuid not null, "trainer_id" uuid not null, "created_by_id" uuid not null, "phone_number" varchar(255) null, "date_of_birth" date null, "height" smallint null, "weight" smallint null, "notes" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), primary key ("id"));`,
    );
    this.addSql(
      `alter table "clients" add constraint "clients_user_id_unique" unique ("user_id");`,
    );

    this.addSql(
      `alter table "trainers" add constraint "trainers_user_id_foreign" foreign key ("user_id") references "users" ("id");`,
    );
    this.addSql(
      `alter table "trainers" add constraint "trainers_created_by_id_foreign" foreign key ("created_by_id") references "users" ("id");`,
    );

    this.addSql(
      `alter table "clients" add constraint "clients_user_id_foreign" foreign key ("user_id") references "users" ("id");`,
    );
    this.addSql(
      `alter table "clients" add constraint "clients_trainer_id_foreign" foreign key ("trainer_id") references "trainers" ("id");`,
    );
    this.addSql(
      `alter table "clients" add constraint "clients_created_by_id_foreign" foreign key ("created_by_id") references "users" ("id");`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(
      `alter table "clients" drop constraint "clients_trainer_id_foreign";`,
    );

    this.addSql(`drop table if exists "trainers" cascade;`);
    this.addSql(`drop table if exists "clients" cascade;`);
  }
}
