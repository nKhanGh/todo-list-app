"use client";

import { TodoFilters } from "@/components/todo/TodoFilters";
import { TodoDetailModal } from "@/components/todo/TodoDetailModal";
import { TodoHeader } from "@/components/todo/TodoHeader";
import { TodoList } from "@/components/todo/TodoList";
import { TodoModal } from "@/components/todo/TodoModal";
import { TodoProgressSummary } from "@/components/todo/TodoProgressSummary";
import { TodoSidebar } from "@/components/todo/TodoSidebar";
import { emptyTodoForm, statusLabel } from "@/components/todo/todo.constants";
import { toInputDateTime } from "@/components/todo/todo.utils";
import {
  createStatusUpdate,
  useTodoDetail,
  useTodos,
  useTodoStatistics,
} from "@/hooks/useTodo";
import type {
  TodoCreateRequest,
  TodoFilters as TodoFiltersState,
  TodoResponse,
  TodoStatus,
} from "@/types/todo";
import { Plus } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [statusMenuTodoId, setStatusMenuTodoId] = useState<string | null>(null);
  const [actionMenuTodoId, setActionMenuTodoId] = useState<string | null>(null);
  const [detailTodo, setDetailTodo] = useState<TodoResponse | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoResponse | null>(null);
  const [form, setForm] = useState<TodoCreateRequest>(emptyTodoForm);
  const [filters, setFilters] = useState<TodoFiltersState>({
    search: "",
    status: "ALL",
    priority: "ALL",
    page: 0,
    size: 10,
    sortBy: "createdAt",
    sortDirection: "desc",
    includeCompleted: true,
  });

  const {
    todosQuery,
    createTodoMutation,
    updateTodoMutation,
    updateTodoStatusMutation,
    deleteTodoMutation,
  } = useTodos(filters);
  const todoStatisticsQuery = useTodoStatistics();
  const todoDetailQuery = useTodoDetail(detailTodo?.id);

  const todos = useMemo(
    () => todosQuery.data?.items ?? [],
    [todosQuery.data?.items]
  );

  const totalElements = todosQuery.data?.totalElements ?? 0;
  const totalPages = todosQuery.data?.totalPages ?? 0;
  const statistics = todoStatisticsQuery.data;
  const doneCount = statistics?.done ?? 0;
  const inProgressCount = statistics?.inProgress ?? 0;
  const todoCount = statistics?.todo ?? 0;
  const totalTodoCount = statistics?.total ?? 0;
  const progress = statistics?.progress ?? 0;
  const everythingDone = totalTodoCount > 0 && doneCount === totalTodoCount;
  const isSaving =
    createTodoMutation.isPending || updateTodoMutation.isPending;

  const openCreate = () => {
    setEditingTodo(null);
    setActionMenuTodoId(null);
    setForm(emptyTodoForm);
    setModalOpen(true);
  };

  const openEdit = (todo: TodoResponse) => {
    setActionMenuTodoId(null);
    setEditingTodo(todo);
    setForm({
      title: todo.title,
      description: todo.description ?? "",
      priority: todo.priority,
      dueDate: toInputDateTime(todo.dueDate),
    });
    setModalOpen(true);
  };

  const openDetail = (todo: TodoResponse) => {
    setActionMenuTodoId(null);
    setDetailTodo(todo);
  };

  const closeDetail = () => {
    setDetailTodo(null);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTodo(null);
    setForm(emptyTodoForm);
  };

  const toggleStatusMenu = (todoId: string) => {
    setActionMenuTodoId(null);
    setStatusMenuTodoId((current) => (current === todoId ? null : todoId));
  };

  const toggleActionMenu = (todoId: string) => {
    setStatusMenuTodoId(null);
    setActionMenuTodoId((current) => (current === todoId ? null : todoId));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: TodoCreateRequest = {
      title: form.title.trim(),
      description: form.description?.trim() || null,
      priority: form.priority || "MEDIUM",
      dueDate: form.dueDate || null,
    };

    if (!payload.title) {
      toast.error("Vui lòng nhập tiêu đề");
      return;
    }

    try {
      if (editingTodo) {
        await updateTodoMutation.mutateAsync({
          id: editingTodo.id,
          data: {
            title: payload.title,
            description: payload.description,
            priority: payload.priority ?? "MEDIUM",
            dueDate: payload.dueDate,
          },
        });
        toast.success("Đã cập nhật công việc");
      } else {
        await createTodoMutation.mutateAsync(payload);
        toast.success("Đã tạo công việc");
      }

      closeModal();
    } catch {
      toast.error("Không thể lưu công việc");
    }
  };

  const changeStatus = async (todo: TodoResponse, status: TodoStatus) => {
    setStatusMenuTodoId(null);

    if (todo.status === status) {
      return;
    }

    try {
      await updateTodoStatusMutation.mutateAsync({
        id: todo.id,
        data: createStatusUpdate(status),
      });
      toast.success(`Đã chuyển sang ${statusLabel[status]}`);
    } catch {
      toast.error("Không thể đổi trạng thái");
    }
  };

  const deleteTodo = async (todo: TodoResponse) => {
    setActionMenuTodoId(null);

    try {
      await deleteTodoMutation.mutateAsync(todo.id);
      toast.success("Đã xóa công việc");
    } catch {
      toast.error("Không thể xóa công việc");
    }
  };

  const goToPreviousPage = () => {
    setFilters((current) => ({
      ...current,
      page: Math.max(0, current.page - 1),
    }));
  };

  const goToNextPage = () => {
    setFilters((current) => ({
      ...current,
      page: current.page + 1,
    }));
  };

  return (
    <main className="min-h-screen bg-[#f5eee9] text-[#1f2937]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-5 pb-24 sm:px-6 lg:px-8 lg:pb-8">
        <TodoHeader
          isFetching={todosQuery.isFetching}
          onRefresh={() => todosQuery.refetch()}
          onCreate={openCreate}
        />

        <TodoProgressSummary
          doneCount={doneCount}
          inProgressCount={inProgressCount}
          totalCount={totalTodoCount}
          progress={progress}
          everythingDone={everythingDone}
        />

        <TodoFilters filters={filters} setFilters={setFilters} />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          <TodoList
            visibleTodos={todos}
            totalElements={totalElements}
            totalPages={totalPages}
            filters={filters}
            hideCompleted={!filters.includeCompleted}
            isFetching={todosQuery.isFetching}
            isLoading={todosQuery.isLoading}
            isError={todosQuery.isError}
            statusMenuTodoId={statusMenuTodoId}
            actionMenuTodoId={actionMenuTodoId}
            onToggleCompleted={() =>
              setFilters((current) => ({
                ...current,
                page: 0,
                includeCompleted: !current.includeCompleted,
              }))
            }
            onOpenDetail={openDetail}
            onOpenEdit={openEdit}
            onChangeStatus={changeStatus}
            onDeleteTodo={deleteTodo}
            onToggleStatusMenu={toggleStatusMenu}
            onToggleActionMenu={toggleActionMenu}
            onPreviousPage={goToPreviousPage}
            onNextPage={goToNextPage}
          />

          <TodoSidebar
            todoCount={todoCount}
            inProgressCount={inProgressCount}
            doneCount={doneCount}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={openCreate}
        className="fixed bottom-5 left-1/2 z-30 grid size-14 -translate-x-1/2 place-items-center rounded-full bg-[#1f8f84] text-white shadow-[0_16px_30px_rgba(31,143,132,0.35)] lg:hidden"
      >
        <Plus className="size-8" />
      </button>

      <TodoModal
        open={modalOpen}
        editingTodo={editingTodo}
        form={form}
        setForm={setForm}
        isSaving={isSaving}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />

      <TodoDetailModal
        open={Boolean(detailTodo)}
        todo={detailTodo}
        detail={todoDetailQuery.data}
        isLoading={todoDetailQuery.isLoading}
        isError={todoDetailQuery.isError}
        onClose={closeDetail}
      />
    </main>
  );
}
