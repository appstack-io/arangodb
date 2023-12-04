import { Injectable } from '@nestjs/common';

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

  async tryDdl(...createFns: (() => Promise<any>)[]) {
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
