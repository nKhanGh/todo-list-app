"use client";

import { todoApi } from "@/services/todo.service";
import type {
  TodoCreateRequest,
  TodoFilters,
  TodoPriority,
  TodoQueryRequest,
  TodoStatus,
  TodoStatusUpdateRequest,
  TodoUpdateRequest,
} from "@/types/todo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const buildTodoQuery = (filters: TodoFilters): TodoQueryRequest => {
  return {
    search: filters.search.trim() || undefined,
    status: filters.status === "ALL" ? undefined : filters.status,
    priority: filters.priority === "ALL" ? undefined : filters.priority,
    page: filters.page,
    size: filters.size,
    sortBy: filters.sortBy,
    sortDirection: filters.sortDirection,
  };
}

export const useTodos = (filters: TodoFilters) => {
  const queryClient = useQueryClient();

  const queryParams = buildTodoQuery(filters);

  const todosQuery = useQuery({
    queryKey: ["todos", queryParams],
    queryFn: () => todoApi.getTodos(queryParams),
  });

  const createTodoMutation = useMutation({
    mutationFn: (data: TodoCreateRequest) => todoApi.createTodo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const updateTodoMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: TodoUpdateRequest;
    }) => todoApi.updateTodo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const updateTodoStatusMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: TodoStatusUpdateRequest;
    }) => todoApi.updateTodoStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: (id: string) => todoApi.deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  return {
    todosQuery,
    createTodoMutation,
    updateTodoMutation,
    updateTodoStatusMutation,
    deleteTodoMutation,
  };
}

export function useTodoDetail(id?: string) {
  return useQuery({
    queryKey: ["todos", id],
    queryFn: () => todoApi.getTodo(id as string),
    enabled: Boolean(id),
  });
}

export function getNextTodoStatus(
  currentStatus: TodoStatus,
  doneStatus: TodoStatus,
  defaultStatus: TodoStatus
): TodoStatus {
  return currentStatus === doneStatus ? defaultStatus : doneStatus;
}

export function createStatusUpdate(status: TodoStatus): TodoStatusUpdateRequest {
  return { status };
}

export function createPriorityFilter(priority: TodoPriority | "ALL") {
  return priority;
}