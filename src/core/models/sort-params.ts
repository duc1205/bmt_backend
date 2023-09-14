import { SortDir } from '../enums/sort-dir';

export class SortParams {
  public readonly sort: string;
  public readonly dir: SortDir;

  constructor(sort = 'id', dir: SortDir = SortDir.asc) {
    this.sort = sort;
    this.dir = dir;
  }
}
