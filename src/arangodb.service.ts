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
}
