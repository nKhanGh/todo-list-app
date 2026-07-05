import { api } from "@/lib/axios";
import type { ApiResponse, PageResponse } from "@/types/api";
import type {
  TodoCreateRequest,
  TodoDetailResponse,
  TodoQueryRequest,
  TodoResponse,
  TodoStatusUpdateRequest,
  TodoUpdateRequest,
} from "@/types/todo";

const removeEmptyParams = (params: TodoQueryRequest): TodoQueryRequest => {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => {
      return value !== undefined && value !== null && value !== "";
    })
  ) as TodoQueryRequest;
}

export const todoApi = {
  async getTodos(
    params: TodoQueryRequest
  ): Promise<PageResponse<TodoResponse>> {
    const response = await api.get<ApiResponse<PageResponse<TodoResponse>>>(
      "/todos",
      {
        params: removeEmptyParams(params),
      }
    );

    return response.data.data;
  },

  async getTodo(id: string): Promise<TodoDetailResponse> {
    const response = await api.get<ApiResponse<TodoDetailResponse>>(
      `/todos/${id}`
    );

    return response.data.data;
  },

  async createTodo(data: TodoCreateRequest): Promise<TodoResponse> {
    const response = await api.post<ApiResponse<TodoResponse>>(
      "/todos",
      data
    );

    return response.data.data;
  },

  async updateTodo(
    id: string,
    data: TodoUpdateRequest
  ): Promise<TodoResponse> {
    const response = await api.put<ApiResponse<TodoResponse>>(
      `/todos/${id}`,
      data
    );

    return response.data.data;
  },

  async updateTodoStatus(
    id: string,
    data: TodoStatusUpdateRequest
  ): Promise<TodoResponse> {
    const response = await api.patch<ApiResponse<TodoResponse>>(
      `/todos/${id}/status`,
      data
    );

    return response.data.data;
  },

  async deleteTodo(id: string): Promise<void> {
    await api.delete<ApiResponse<null>>(`/todos/${id}`);
  },
};