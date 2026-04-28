import { Migration } from '@mikro-orm/migrations';

export class Migration20260428144437 extends Migration {
  override up(): void | Promise<void> {
    this.addSql(`alter table "users" add "phone_number" varchar(255) null;`);

    this.addSql(`alter table "clients" drop column "phone_number";`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "users" drop column "phone_number";`);

    this.addSql(`alter table "clients" add "phone_number" varchar(255) null;`);
  }
}
