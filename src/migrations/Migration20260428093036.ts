import { Migration } from '@mikro-orm/migrations';

export class Migration20260428093036 extends Migration {
  override up(): void | Promise<void> {
    this.addSql(
      `alter table "trainers" add "slot_generation_days" smallint not null default 21;`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "trainers" drop column "slot_generation_days";`);
  }
}
