import {
  CalendarDays,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  ListChecks,
  Loader2,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import type { TodoFilters, TodoResponse, TodoStatus } from "@/types/todo";

import { priorityLabel, statusLabel, todoStatuses } from "./todo.constants";
import { formatDateTime, priorityTone, statusTone } from "./todo.utils";

type TodoListProps = {
  visibleTodos: TodoResponse[];
  totalElements: number;
  totalPages: number;
  filters: TodoFilters;
  hideCompleted: boolean;
  isFetching: boolean;
  isLoading: boolean;
  isError: boolean;
  statusMenuTodoId: string | null;
  actionMenuTodoId: string | null;
  onToggleCompleted: () => void;
  onOpenDetail: (todo: TodoResponse) => void;
  onOpenEdit: (todo: TodoResponse) => void;
  onChangeStatus: (todo: TodoResponse, status: TodoStatus) => void;
  onDeleteTodo: (todo: TodoResponse) => void;
  onToggleStatusMenu: (todoId: string) => void;
  onToggleActionMenu: (todoId: string) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
};

export function TodoList({
  visibleTodos,
  totalElements,
  totalPages,
  filters,
  hideCompleted,
  isFetching,
  isLoading,
  isError,
  statusMenuTodoId,
  actionMenuTodoId,
  onToggleCompleted,
  onOpenDetail,
  onOpenEdit,
  onChangeStatus,
  onDeleteTodo,
  onToggleStatusMenu,
  onToggleActionMenu,
  onPreviousPage,
  onNextPage,
}: Readonly<TodoListProps>) {
  return (
    <section className="rounded-[1.7rem] bg-[#fbf7f3] p-4 shadow-[0_18px_45px_rgba(70,37,21,0.1)] ring-1 ring-white/70 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-[#4d5968]">
            Danh sách công việc
          </h2>
          <p className="mt-1 text-sm text-[#7d858f]">
            {isFetching ? "Đang tải công việc..." : `${totalElements} công việc`}
          </p>
        </div>
        <button
          type="button"
          onClick={onToggleCompleted}
          className="inline-flex items-center gap-1.5 rounded-2xl bg-[#e1f4ee] px-3 py-2 text-xs font-extrabold text-[#1f8f84]"
        >
          {hideCompleted ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
          {hideCompleted ? "Ẩn đã xong" : "Hiện đã xong"}
        </button>
      </div>

      <div className="overflow-visible rounded-2xl bg-white shadow-[0_8px_20px_rgba(55,35,20,0.07)] ring-1 ring-[#eee5df]">
        {isLoading && (
          <div className="flex min-h-48 items-center justify-center text-sm text-[#7d858f]">
            <Loader2 className="mr-2 size-4 animate-spin" />
            Đang tải công việc...
          </div>
        )}

        {isError && (
          <div className="min-h-48 px-6 py-8 text-center text-sm text-[#a73524]">
            Không thể tải công việc. Kiểm tra backend và địa chỉ API.
          </div>
        )}

        {!isLoading && !isError && visibleTodos.length === 0 && (
          <div className="grid min-h-48 place-items-center px-6 py-8 text-center">
            <div>
              <div className="mx-auto mb-3 grid size-14 place-items-center rounded-2xl bg-[#caece3] text-[#1f8f84]">
                <ListChecks className="size-8" />
              </div>
              <p className="text-sm font-medium text-[#4d5968]">
                {hideCompleted
                  ? "Tất cả công việc đang hiển thị đã hoàn thành"
                  : "Chưa có công việc nào"}
              </p>
            </div>
          </div>
        )}

        {visibleTodos.map((todo, index) => {
          const done = todo.status === "DONE";
          const statusMenuOpen = statusMenuTodoId === todo.id;
          const actionMenuOpen = actionMenuTodoId === todo.id;

          return (
            <div
              key={todo.id}
              className={`relative grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 px-4 py-4 sm:px-5 ${
                index > 0 ? "border-t border-[#eee5df]" : ""
              }`}
            >
              <div
                className={`mt-0.5 grid size-5 place-items-center rounded-full border transition ${
                  done
                    ? "border-[#bfe8df] bg-[#1fbbb0] text-white"
                    : "border-[#1fbbb0] bg-white text-transparent"
                }`}
                title={statusLabel[todo.status]}
              >
                <Check className="size-3.5" strokeWidth={3} />
              </div>

              <div className="min-w-0">
                <div
                  className="block w-full min-w-0 text-left"
                >
                  <p
                    className={`truncate text-sm font-semibold sm:text-base ${
                      done ? "text-[#b4b8ba] line-through" : "text-[#243040]"
                    }`}
                  >
                    {todo.title}
                  </p>
                  {todo.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-[#7d858f]">
                      {todo.description}
                    </p>
                  )}
                </div>

                <div className="relative mt-2 flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => onToggleStatusMenu(todo.id)}
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold transition hover:brightness-95 ${statusTone(todo.status)}`}
                    title="Đổi trạng thái"
                  >
                    {statusLabel[todo.status]}
                    <ChevronDown
                      className={`size-3 transition ${
                        statusMenuOpen ? "rotate-180" : ""
                      }`}
                      strokeWidth={3}
                    />
                  </button>

                  {statusMenuOpen && (
                    <div className="absolute left-0 top-7 z-30 w-44 rounded-2xl border border-[#dfd1c9] bg-white p-2 shadow-[0_16px_38px_rgba(61,36,21,0.18)]">
                      <p className="px-2 pb-1 text-[11px] font-extrabold uppercase tracking-wide text-[#8a7468]">
                        Đổi trạng thái
                      </p>
                      {todoStatuses.map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => onChangeStatus(todo, status)}
                          className={`flex w-full items-center justify-between rounded-xl px-2 py-2 text-left text-sm font-bold transition hover:bg-[#f4ece6] ${
                            todo.status === status
                              ? "text-[#1f8f84]"
                              : "text-[#2f2521]"
                          }`}
                        >
                          {statusLabel[status]}
                          {todo.status === status && (
                            <Check className="size-4" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${priorityTone(todo.priority)}`}
                  >
                    {priorityLabel[todo.priority]}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#f4ece7] px-2 py-0.5 text-[10px] font-extrabold text-[#8a7468]">
                    <CalendarDays className="size-3" />
                    {formatDateTime(todo.dueDate)}
                  </span>
                </div>
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => onToggleActionMenu(todo.id)}
                  className="grid size-8 place-items-center rounded-full text-[#9b6a5c] transition hover:bg-[#f3ece7] hover:text-[#5d4638]"
                  title="Mở menu thao tác"
                >
                  <MoreHorizontal className="size-5" />
                </button>

                {actionMenuOpen && (
                  <div className="absolute right-0 top-9 z-30 w-40 rounded-2xl border border-[#dfd1c9] bg-white p-2 shadow-[0_16px_38px_rgba(61,36,21,0.18)]">
                    <button
                      type="button"
                      onClick={() => onOpenDetail(todo)}
                      className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm font-bold text-[#2f2521] transition hover:bg-[#f4ece6]"
                    >
                      <Eye className="size-4 text-[#1f8f84]" />
                      Xem chi tiết
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenEdit(todo)}
                      className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm font-bold text-[#2f2521] transition hover:bg-[#f4ece6]"
                    >
                      <Pencil className="size-4 text-[#8a7468]" />
                      Chỉnh sửa
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteTodo(todo)}
                      className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm font-bold text-[#a73524] transition hover:bg-[#f9e7e2]"
                    >
                      <Trash2 className="size-4" />
                      Xóa
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          disabled={filters.page <= 0}
          onClick={onPreviousPage}
          className="rounded-2xl bg-[#f3ece7] px-4 py-2 text-sm font-extrabold text-[#5d4638] disabled:opacity-40"
        >
          Trước
        </button>
        <span className="text-xs font-bold text-[#7d858f]">
          Trang {filters.page + 1} / {Math.max(totalPages, 1)}
        </span>
        <button
          type="button"
          disabled={totalPages === 0 || filters.page + 1 >= totalPages}
          onClick={onNextPage}
          className="rounded-2xl bg-[#f3ece7] px-4 py-2 text-sm font-extrabold text-[#5d4638] disabled:opacity-40"
        >
          Sau
        </button>
      </div>
    </section>
  );
}
