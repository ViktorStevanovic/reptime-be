import { Migration } from '@mikro-orm/migrations';

export class Migration20260427094317 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`create table "schedule_templates" ("id" uuid not null default gen_random_uuid(), "trainer_id" uuid not null, "week_day" smallint not null, "start_time" varchar(255) not null, "end_time" varchar(255) not null, "block_time" smallint not null, "active" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), primary key ("id"));`);

    this.addSql(`alter table "schedule_templates" add constraint "schedule_templates_trainer_id_foreign" foreign key ("trainer_id") references "trainers" ("id");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "schedule_templates" cascade;`);
  }

}
