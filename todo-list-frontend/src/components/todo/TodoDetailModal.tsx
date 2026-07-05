import { Check, Circle, Clock, Loader2, X } from "lucide-react";
import { useMemo } from "react";

import type {
  TodoDetailResponse,
  TodoResponse,
  TodoStatus,
  TodoStatusHistoryResponse,
} from "@/types/todo";

import { priorityLabel, statusLabel } from "./todo.constants";
import { formatDateTime, priorityTone, statusTone } from "./todo.utils";

type TodoDetailModalProps = {
  open: boolean;
  todo?: TodoResponse | null;
  detail?: TodoDetailResponse;
  isLoading: boolean;
  isError: boolean;
  onClose: () => void;
};

type TimelineItem = {
  id: string;
  status: TodoStatus;
  changedAt: string;
};

function toTimelineItem(
  history: TodoStatusHistoryResponse,
  index: number
): TimelineItem {
  return {
    id: history.id || `${history.toStatus}-${history.changedAt}-${index}`,
    status: history.toStatus,
    changedAt: history.changedAt,
  };
}

function StatusIcon({ status }: Readonly<{ status: TodoStatus }>) {
  if (status === "DONE") {
    return <Check className="size-4" strokeWidth={3} />;
  }

  if (status === "IN_PROGRESS") {
    return <Clock className="size-4" strokeWidth={2.5} />;
  }

  return <Circle className="size-3.5" strokeWidth={3} />;
}

export function TodoDetailModal({
  open,
  todo,
  detail,
  isLoading,
  isError,
  onClose,
}: Readonly<TodoDetailModalProps>) {
  const currentTodo = detail ?? todo;
  const timeline = useMemo(() => {
    if (detail?.statusHistories?.length) {
      return [...detail.statusHistories]
        .sort(
          (left, right) =>
            new Date(left.changedAt).getTime() -
            new Date(right.changedAt).getTime()
        )
        .map((element, index) => toTimelineItem(element, index));
    }

    if (currentTodo) {
      return [
        {
          id: `${currentTodo.id}-${currentTodo.status}`,
          status: currentTodo.status,
          changedAt: currentTodo.updatedAt,
        },
      ];
    }

    return [];
  }, [currentTodo, detail]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#241608]/30 p-4 backdrop-blur-sm">
      <section className="w-full max-w-xl rounded-[1.8rem] bg-[#fbf7f3] p-5 shadow-[0_26px_70px_rgba(70,37,21,0.22)] ring-1 ring-white/70">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-extrabold uppercase tracking-wide text-[#8a7468]">
              Chi tiết công việc
            </p>
            <h3 className="mt-1 truncate text-2xl font-black tracking-[-0.02em] text-[#243040]">
              {currentTodo?.title ?? "Đang tải..."}
            </h3>
            {currentTodo?.description && (
              <p className="mt-2 text-sm leading-6 text-[#7d858f]">
                {currentTodo.description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 shrink-0 place-items-center rounded-full bg-[#f3ece7] text-[#5d4638]"
          >
            <X className="size-4" />
          </button>
        </div>

        {isLoading && (
          <div className="flex min-h-44 items-center justify-center text-sm font-bold text-[#7d858f]">
            <Loader2 className="mr-2 size-4 animate-spin" />
            Đang tải chi tiết...
          </div>
        )}

        {isError && (
          <div className="rounded-2xl bg-[#f9e7e2] px-4 py-5 text-sm font-bold text-[#a73524]">
            Không thể tải chi tiết công việc.
          </div>
        )}

        {!isLoading && !isError && currentTodo && (
          <div className="grid gap-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-4 ring-1 ring-[#eee5df]">
                <p className="text-xs font-extrabold text-[#8a7468]">
                  Trạng thái
                </p>
                <span
                  className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-xs font-extrabold ${statusTone(currentTodo.status)}`}
                >
                  {statusLabel[currentTodo.status]}
                </span>
              </div>
              <div className="rounded-2xl bg-white p-4 ring-1 ring-[#eee5df]">
                <p className="text-xs font-extrabold text-[#8a7468]">
                  Ưu tiên
                </p>
                <span
                  className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-xs font-extrabold ${priorityTone(currentTodo.priority)}`}
                >
                  {priorityLabel[currentTodo.priority]}
                </span>
              </div>
              <div className="rounded-2xl bg-white p-4 ring-1 ring-[#eee5df]">
                <p className="text-xs font-extrabold text-[#8a7468]">
                  Hạn hoàn thành
                </p>
                <p className="mt-2 text-sm font-black text-[#5d4638]">
                  {formatDateTime(currentTodo.dueDate)}
                </p>
              </div>
            </div>

            <div className="rounded-2xl max-h-100 overflow-y-auto bg-white p-4 ring-1 ring-[#eee5df]">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-sm font-black text-[#4d5968]">Tiến trình</h4>
                <span className="text-xs font-bold text-[#8a7468]">
                  {timeline.length} mốc
                </span>
              </div>

              <div className="grid gap-0">
                {timeline.map((item, index) => {
                  const last = index === timeline.length - 1;

                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-[32px_minmax(0,1fr)] gap-3"
                    >
                      <div className="grid justify-items-center">
                        <div
                          className={`grid size-8 place-items-center rounded-full border-2 ${statusTone(item.status)}`}
                        >
                          <StatusIcon status={item.status} />
                        </div>
                        {!last && <div className="h-10 w-0.5 bg-[#ddcec5]" />}
                      </div>
                      <div className="pb-5">
                        <p className="text-sm font-black text-[#243040]">
                          {statusLabel[item.status]} -{" "}
                          {formatDateTime(item.changedAt)}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-[#8a7468]">
                          Công việc được chuyển sang trạng thái này.
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
