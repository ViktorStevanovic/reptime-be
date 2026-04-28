import { Migration } from '@mikro-orm/migrations';

export class Migration20260428141543 extends Migration {
  override up(): void | Promise<void> {
    this.addSql(
      `create table "client_bia_scans" ("id" uuid not null default gen_random_uuid(), "client_id" uuid not null, "trainer_id" uuid not null, "appointment_id" uuid null, "measured_at" timestamptz not null, "weight" int not null, "body_fat_percentage" double precision null, "muscle_mass" int null, "notes" text null, "created_at" timestamptz not null default now(), primary key ("id"));`,
    );

    this.addSql(
      `create table "client_bia_circumferences" ("id" uuid not null default gen_random_uuid(), "bia_scan_id" uuid not null, "chest_cm" double precision null, "waist_cm" double precision null, "hips_cm" double precision null, "left_arm_cm" double precision null, "right_arm_cm" double precision null, "left_thigh_cm" double precision null, "right_thigh_cm" double precision null, "left_calf_cm" double precision null, "right_calf_cm" double precision null, primary key ("id"));`,
    );
    this.addSql(
      `alter table "client_bia_circumferences" add constraint "client_bia_circumferences_bia_scan_id_unique" unique ("bia_scan_id");`,
    );

    this.addSql(
      `alter table "client_bia_scans" add constraint "client_bia_scans_client_id_foreign" foreign key ("client_id") references "clients" ("id");`,
    );
    this.addSql(
      `alter table "client_bia_scans" add constraint "client_bia_scans_trainer_id_foreign" foreign key ("trainer_id") references "trainers" ("id");`,
    );
    this.addSql(
      `alter table "client_bia_scans" add constraint "client_bia_scans_appointment_id_foreign" foreign key ("appointment_id") references "appointments" ("id") on delete set null;`,
    );

    this.addSql(
      `alter table "client_bia_circumferences" add constraint "client_bia_circumferences_bia_scan_id_foreign" foreign key ("bia_scan_id") references "client_bia_scans" ("id");`,
    );

    this.addSql(
      `alter table "clients" drop column "height", drop column "weight";`,
    );
    this.addSql(
      `alter table "clients" add "gender" varchar(255) null, add "height_cm" smallint null, add "goal" varchar(255) null;`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(
      `alter table "client_bia_circumferences" drop constraint "client_bia_circumferences_bia_scan_id_foreign";`,
    );

    this.addSql(`drop table if exists "client_bia_scans" cascade;`);
    this.addSql(`drop table if exists "client_bia_circumferences" cascade;`);

    this.addSql(
      `alter table "clients" drop column "gender", drop column "goal";`,
    );
    this.addSql(`alter table "clients" add "weight" smallint null;`);
    this.addSql(`alter table "clients" rename column "height_cm" to "height";`);
  }
}
