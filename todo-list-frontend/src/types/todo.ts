export type TodoPriority = "LOW" | "MEDIUM" | "HIGH";

export type TodoStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type TodoStatusFilter = TodoStatus | "ALL";

export type TodoPriorityFilter = TodoPriority | "ALL";

export type TodoSortBy =
  | "createdAt"
  | "updatedAt"
  | "dueDate"
  | "priority"
  | "status"
  | "title";

export type SortDirection = "asc" | "desc";

export interface TodoResponse {
  id: string;
  title: string;
  description: string | null;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TodoStatusHistoryResponse {
  id: string;
  fromStatus: TodoStatus | null;
  toStatus: TodoStatus;
  changedAt: string;
}

export interface TodoDetailResponse extends TodoResponse {
  statusHistories: TodoStatusHistoryResponse[];
}

export interface TodoStatisticsResponse {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  progress: number;
}

export interface TodoCreateRequest {
  title: string;
  description?: string | null;
  priority?: TodoPriority | null;
  dueDate?: string | null;
}

export interface TodoUpdateRequest {
  title: string;
  description?: string | null;
  priority: TodoPriority;
  dueDate?: string | null;
}

export interface TodoStatusUpdateRequest {
  status: TodoStatus;
}

export interface TodoQueryRequest {
  search?: string;
  status?: TodoStatus;
  priority?: TodoPriority;
  page?: number;
  size?: number;
  sortBy?: TodoSortBy;
  sortDirection?: SortDirection;
}

export interface TodoFilters {
  search: string;
  status: TodoStatusFilter;
  priority: TodoPriorityFilter;
  page: number;
  size: number;
  sortBy: TodoSortBy;
  sortDirection: SortDirection;
}
