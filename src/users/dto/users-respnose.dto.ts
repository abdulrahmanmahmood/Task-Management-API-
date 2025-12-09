import { PaginatedResponse } from 'src/common/interface/paginated-response';

export class UsersResponseDto<T> implements PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
