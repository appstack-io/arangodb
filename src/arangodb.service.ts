import { Injectable } from '@nestjs/common';
import { Database } from 'arangojs';
import { ArangodbUtils } from './arangodbUtils';

@Injectable()
export class ArangodbService {
  db: Database;

  constructor(public utils: ArangodbUtils) {
    this.setDb();
  }

  private setDb() {
    this.db = new Database({
      url: process.env.ARANGO_URL,
      databaseName: process.env.ARANGO_DBNAME,
      auth: {
        username: process.env.ARANGO_USERNAME,
        password: process.env.ARANGO_PASSWORD,
      },
    });
  }

  async initDb() {
    try {
      const db = new Database({
        url: process.env.ARANGO_URL,
        auth: {
          username: process.env.ARANGO_USERNAME,
          password: process.env.ARANGO_PASSWORD,
        },
      });
      await db.createDatabase(process.env.ARANGO_DBNAME);
    } catch (e) {
      if (e.message.indexOf('duplicate database name') < 0) throw e;
    } finally {
      this.setDb();
    }
  }
}
