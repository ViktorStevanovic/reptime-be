import { Migration } from '@mikro-orm/migrations';

export class Migration20260423095611 extends Migration {
  override up(): void | Promise<void> {
    this.addSql(
      `alter table "users" add "hashed_refresh_token" varchar(255) null;`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "users" drop column "hashed_refresh_token";`);
  }
}
