import { Loader2, Plus, RotateCcw } from "lucide-react";

import { todayLabel } from "./todo.utils";

type TodoHeaderProps = {
  isFetching: boolean;
  onRefresh: () => void;
  onCreate: () => void;
};

export function TodoHeader({
  isFetching,
  onRefresh,
  onCreate,
}: Readonly<TodoHeaderProps>) {
  return (
    <header className="flex flex-col gap-4 rounded-[1.7rem] bg-[#fbf7f3] p-5 shadow-[0_18px_45px_rgba(70,37,21,0.12)] ring-1 ring-white/70 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-2xl font-black tracking-[-0.03em] text-[#18222d]">
          Chào buổi tối!
        </p>
        <p className="mt-1 text-sm font-medium text-[#566171]">
          {todayLabel()}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[#efe5dc] px-4 text-sm font-extrabold text-[#6b4a38]"
        >
          {isFetching ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <RotateCcw className="size-4" />
          )}
          Làm mới
        </button>
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[#1f8f84] px-4 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(31,143,132,0.24)]"
        >
          <Plus className="size-4" />
          Thêm việc
        </button>
      </div>
    </header>
  );
}
