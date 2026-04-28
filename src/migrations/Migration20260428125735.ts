import { Migration } from '@mikro-orm/migrations';

export class Migration20260428125735 extends Migration {
  override up(): void | Promise<void> {
    this.addSql(
      `create table "appointments" ("id" uuid not null default gen_random_uuid(), "trainer_id" uuid not null, "client_id" uuid not null, "slot_id" uuid not null, "status" varchar(255) not null default 'scheduled', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), primary key ("id"));`,
    );

    this.addSql(
      `alter table "appointments" add constraint "appointments_trainer_id_foreign" foreign key ("trainer_id") references "trainers" ("id");`,
    );
    this.addSql(
      `alter table "appointments" add constraint "appointments_client_id_foreign" foreign key ("client_id") references "clients" ("id");`,
    );
    this.addSql(
      `alter table "appointments" add constraint "appointments_slot_id_foreign" foreign key ("slot_id") references "availability_slots" ("id");`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "appointments" cascade;`);
  }
}
