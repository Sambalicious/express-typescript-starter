
export interface PaginationOptions {
  page: number;
  pageSize: number;
  orderBy?: Record<string, "asc" | "desc">;
  where?: Record<string, any>;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE = 1;  

export class BaseRepository<T, ModelDelegate extends { findMany: Function; count: Function }> {
  protected model: ModelDelegate;

  constructor(model: ModelDelegate) {
    this.model = model;
  }

  async findAllPaginated(options: PaginationOptions): Promise<PaginatedResult<T>> {
    const { page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE, orderBy = { createdAt: "desc" }, where = {} } = options;
    const skip = (page - 1) * pageSize;
    const [data, total] = await Promise.all([
      this.model.findMany({ skip, take: pageSize, orderBy, where }),
      this.model.count({ where }),
    ]);
    return {
      data,
      total,
      page,
      pageSize,
    };
  }
}
