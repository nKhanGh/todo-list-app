import type { Dispatch, FormEventHandler, SetStateAction } from "react";
import { Loader2, X } from "lucide-react";

import type { TodoCreateRequest, TodoPriority, TodoResponse } from "@/types/todo";

import { TodoDateTimePicker } from "./TodoDateTimePicker";
import { TodoField } from "./TodoField";
import { TodoSelectField } from "./TodoSelectField";
import { priorityLabel, todoPriorities } from "./todo.constants";

type TodoModalProps = {
  open: boolean;
  editingTodo: TodoResponse | null;
  form: TodoCreateRequest;
  setForm: Dispatch<SetStateAction<TodoCreateRequest>>;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

export function TodoModal({
  open,
  editingTodo,
  form,
  setForm,
  isSaving,
  onClose,
  onSubmit,
}: Readonly<TodoModalProps>) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#241608]/30 p-4 backdrop-blur-sm">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-lg rounded-[1.8rem] bg-[#fbf7f3] p-5 shadow-[0_26px_70px_rgba(70,37,21,0.22)] ring-1 ring-white/70"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-black tracking-[-0.02em]">
            {editingTodo ? "Sửa công việc" : "Thêm công việc"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-full bg-[#f3ece7] text-[#5d4638]"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="grid gap-3">
          <TodoField label="Tiêu đề">
            <input
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              className="h-12 w-full min-w-0 rounded-2xl border border-[#dfd1c9] bg-white px-4 text-sm font-semibold text-[#2f2521] outline-none focus:border-[#1f8f84] focus:ring-4 focus:ring-[#bfe8df]"
              placeholder="Ví dụ: xem lại thiết kế"
              maxLength={255}
            />
          </TodoField>

          <TodoField label="Mô tả">
            <textarea
              value={form.description ?? ""}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              className="min-h-24 w-full min-w-0 resize-y rounded-2xl border border-[#dfd1c9] bg-white px-4 py-3 text-sm font-semibold text-[#2f2521] outline-none focus:border-[#1f8f84] focus:ring-4 focus:ring-[#bfe8df]"
              placeholder="Chi tiết công việc"
              maxLength={1000}
            />
          </TodoField>

          <div className="grid gap-3 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <TodoField label="Ưu tiên">
              <TodoSelectField<TodoPriority>
                value={(form.priority ?? "MEDIUM") as TodoPriority}
                onChange={(priority) =>
                  setForm((current) => ({ ...current, priority }))
                }
                options={todoPriorities.map((priority) => ({
                  value: priority,
                  label: priorityLabel[priority],
                }))}
                triggerClassName="h-12 bg-white"
              />
            </TodoField>

            <TodoField label="Hạn hoàn thành">
              <TodoDateTimePicker
                value={form.dueDate}
                onChange={(dueDate) =>
                  setForm((current) => ({
                    ...current,
                    dueDate,
                  }))
                }
              />
            </TodoField>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-2xl bg-[#f3ece7] text-sm font-extrabold text-[#5d4638]"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#1f8f84] text-sm font-extrabold text-white disabled:opacity-60"
          >
            {isSaving && <Loader2 className="size-4 animate-spin" />}
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
}
