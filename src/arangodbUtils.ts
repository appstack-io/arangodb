import { Injectable } from '@nestjs/common';
import { Database } from 'arangojs';

@Injectable()
export class ArangodbUtils {
  format<T>(item: T & { _id?: string }): T {
    return { ...item, id: item._id };
  }

  addCreatedAt<T>(item: T): T & { createdAt: number } {
    return { ...item, createdAt: Date.now() };
  }

  addUpdatedAt<T>(item: T): T & { updatedAt: number } {
    return { ...item, updatedAt: Date.now() };
  }

  addTs<T>(item: T): T & { createdAt: number; updatedAt: number } {
    return { ...item, createdAt: Date.now(), updatedAt: Date.now() };
  }

  async createAppDb() {
    try {
      const db = new Database({
        url: process.env.ARANGO_URL,
        databaseName: '_system',
        auth: {
          username: process.env.ARANGO_USERNAME,
          password: process.env.ARANGO_PASSWORD,
        },
      });
      await db.createDatabase(process.env.ARANGO_DBNAME);
    } catch (e) {
      if (e.message.indexOf('duplicate database name') < 0) throw e;
    }
  }

  async tryDdl(...createFns: (() => Promise<any>)[]) {
    await this.createAppDb();
    for (const createFn of createFns) {
      try {
        await createFn();
      } catch (e) {
        if (e.message.indexOf('duplicate name') < 0) throw e;
      }
    }
  }

  async tryCreateUnique<T>(
    createFn: () => Promise<T>,
    findUniqueFn: () => Promise<T>,
  ) {
    await this.createAppDb();
    try {
      return await createFn();
    } catch (e) {
      if (e.message.indexOf('unique constraint violated') > -1) {
        const found = await findUniqueFn();
        if (!found) {
          throw new Error(
            `did not find a unique document that is supposed to exist `,
          );
        }
        return found;
      }
    }
  }
}
