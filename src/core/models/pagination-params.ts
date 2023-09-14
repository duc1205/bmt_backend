export class PaginationParams {
  public readonly page: number;
  public readonly limit: number;
  public readonly needTotalCount: boolean;
  public readonly onlyCount: boolean;

  constructor(page = 1, limit = 10, needTotalCount = true, onlyCount = false) {
    this.page = page;
    this.limit = limit;
    this.onlyCount = onlyCount;
    this.needTotalCount = onlyCount ? true : needTotalCount;
  }
}
