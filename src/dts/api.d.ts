interface Paginated<T> {
  list: T
  total: number
  total_pages: number
}

interface Res<T = any, Pagination extends boolean = false> {
  data: Pagination extends true ? Paginated<T> : T
  desc: "successful" | string
  error: number
}

type PaginateArgs = Partial<{
  page: number
  limit: number
}>
