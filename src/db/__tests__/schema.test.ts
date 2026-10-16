import { DATABASE_VERSION, MIGRATIONS } from '@/db/schema';

describe('schema', () => {
  // The runner skips migrating once `user_version` reaches DATABASE_VERSION,
  // so a migration appended without bumping it never runs on existing installs.
  it('versions the database at the number of migrations', () => {
    expect(DATABASE_VERSION).toBe(MIGRATIONS.length);
  });
});
