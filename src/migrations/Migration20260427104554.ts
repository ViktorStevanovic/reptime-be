import { Migration } from '@mikro-orm/migrations';

export class Migration20260427104554 extends Migration {
  override up(): void | Promise<void> {
    this.addSql(
      `create table "availability_slots" ("id" uuid not null default gen_random_uuid(), "trainer_id" uuid not null, "date" date not null, "start_time" varchar(255) not null, "end_time" varchar(255) not null, "active" boolean not null default true, "booked" boolean not null default false, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), primary key ("id"));`,
    );

    this.addSql(
      `alter table "availability_slots" add constraint "availability_slots_trainer_id_foreign" foreign key ("trainer_id") references "trainers" ("id");`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "availability_slots" cascade;`);
  }
}
