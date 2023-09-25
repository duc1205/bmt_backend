import { promises as fs } from 'fs';
import { join } from 'path';
import { PageList } from '../models/page-list';
import { DomainModel } from '../models/domain-model';
import { SelectQueryBuilder } from 'typeorm';

export function throwError(errorMessage = ''): never {
  throw new Error(errorMessage);
}

export const isExistsQuery = (query: string) => `EXISTS(${query}) AS "exists"`;

// TODO: remove this once it is provided by TypeORM (in case that ever happens)
declare module 'typeorm' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface SelectQueryBuilder<Entity> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    exists<T>(): Promise<boolean>;
  }
}

SelectQueryBuilder.prototype.exists = async function (): Promise<boolean> {
  const result = await this.select(isExistsQuery(this.getQuery())).where('').getRawOne();
  return result?.exists ?? false;
};

export const parseBoolean = (val: string | boolean | number | undefined, strict = true): boolean | undefined => {
  if ((val === undefined || val === null) && !strict) {
    return val;
  }

  const s = val && val.toString().toLowerCase().trim();
  return s == 'true' || s == '1';
};

export const readJsonFile = async (fileName: string): Promise<any> => {
  const data = await fs.readFile(join(process.cwd(), fileName));
  const stringData = data.toString();

  return JSON.parse(stringData);
};

export const normalizeResponseData = (result: any, showHidden = false): any => {
  let data: any = result;
  if (result instanceof PageList) {
    data = result.data.map((model) => model.toJson(showHidden));
  } else if (result instanceof DomainModel) {
    data = result.toJson(showHidden);
  } else if (Array.isArray(result)) {
    data = result.map((item) => {
      if (item instanceof DomainModel) {
        return item.toJson(showHidden);
      }
      return item;
    });
  }

  return data ?? null;
};
