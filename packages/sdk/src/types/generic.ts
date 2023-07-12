export class ApillonPaginationInput {
  constructor(page?: number, limit?: number, orderBy?: string, desc?: boolean) {
    this.page = page;
    this.limit = limit;
    this.orderBy = orderBy;
    this.desc = desc;
  }

  page?: number;
  limit?: number;
  orderBy?: string;
  desc?: boolean;
}
