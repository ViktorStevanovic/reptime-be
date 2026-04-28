import { Migration } from '@mikro-orm/migrations';

export class Migration20260428100419 extends Migration {
  override up(): void | Promise<void> {
    this.addSql(
      `create table "availability_overrides" ("id" uuid not null default gen_random_uuid(), "trainer_id" uuid not null, "start_date" date not null, "end_date" date not null, "full_day" boolean not null default false, "start_time" varchar(255) null, "end_time" varchar(255) null, "reason" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), primary key ("id"));`,
    );

    this.addSql(
      `alter table "availability_overrides" add constraint "availability_overrides_trainer_id_foreign" foreign key ("trainer_id") references "trainers" ("id");`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "availability_overrides" cascade;`);
  }
}
