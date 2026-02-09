import path from 'path';
import { fileURLToPath } from 'url';
import { Umzug, SequelizeStorage } from 'umzug';
import sequelize from './config/database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const umzug = new Umzug({
  migrations: {
    glob: path.join(__dirname, 'migrations', '*.mjs'),
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

export async function runMigrations() {
  await umzug.up();
}
