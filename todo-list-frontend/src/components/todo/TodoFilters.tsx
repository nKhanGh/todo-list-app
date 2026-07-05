import type { Dispatch, SetStateAction } from "react";
import { Search } from "lucide-react";

import type {
  TodoFilters as TodoFiltersState,
  TodoPriorityFilter,
  TodoSortBy,
  TodoStatusFilter,
} from "@/types/todo";

import { TodoField } from "./TodoField";
import { TodoSelectField } from "./TodoSelectField";
import {
  filterLabel,
  priorityLabel,
  sortDirectionLabel,
  sortLabel,
  todoPriorities,
  todoStatuses,
  statusLabel,
} from "./todo.constants";

type TodoFiltersProps = {
  filters: TodoFiltersState;
  setFilters: Dispatch<SetStateAction<TodoFiltersState>>;
};

export function TodoFilters({ filters, setFilters }: Readonly<TodoFiltersProps>) {
  return (
    <section className="grid gap-4 rounded-[1.7rem] bg-[#fbf7f3] p-4 shadow-[0_18px_45px_rgba(70,37,21,0.1)] ring-1 ring-white/70 lg:grid-cols-[minmax(260px,1fr)_repeat(4,minmax(130px,170px))]">
      <TodoField label="Tìm kiếm">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9d8f86]" />
          <input
            value={filters.search}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                page: 0,
                search: event.target.value,
              }))
            }
            className="h-11 w-full rounded-2xl border border-[#ddcec5] bg-[#fffaf6] px-3 pl-9 text-sm font-semibold text-[#34251e] outline-none transition placeholder:text-[#9d8f86] focus:border-[#1f8f84] focus:ring-4 focus:ring-[#bfe8df]"
            placeholder="Tìm công việc"
          />
        </div>
      </TodoField>

      <TodoField label="Trạng thái">
        <TodoSelectField<TodoStatusFilter>
          value={filters.status}
          onChange={(status) =>
            setFilters((current) => ({ ...current, page: 0, status }))
          }
          options={[
            { value: "ALL", label: filterLabel.all },
            ...todoStatuses.map((status) => ({
              value: status,
              label: statusLabel[status],
            })),
          ]}
        />
      </TodoField>

      <TodoField label="Ưu tiên">
        <TodoSelectField<TodoPriorityFilter>
          value={filters.priority}
          onChange={(priority) =>
            setFilters((current) => ({ ...current, page: 0, priority }))
          }
          options={[
            { value: "ALL", label: filterLabel.all },
            ...todoPriorities.map((priority) => ({
              value: priority,
              label: priorityLabel[priority],
            })),
          ]}
        />
      </TodoField>

      <TodoField label="Sắp xếp">
        <TodoSelectField<TodoSortBy>
          value={filters.sortBy}
          onChange={(sortBy) =>
            setFilters((current) => ({ ...current, page: 0, sortBy }))
          }
          options={[
            { value: "createdAt", label: sortLabel.createdAt },
            { value: "updatedAt", label: sortLabel.updatedAt },
            { value: "dueDate", label: sortLabel.dueDate },
            { value: "priority", label: sortLabel.priority },
            { value: "status", label: sortLabel.status },
            { value: "title", label: sortLabel.title },
          ]}
        />
      </TodoField>

      <TodoField label="Thứ tự">
        <TodoSelectField<"asc" | "desc">
          value={filters.sortDirection}
          onChange={(sortDirection) =>
            setFilters((current) => ({
              ...current,
              page: 0,
              sortDirection,
            }))
          }
          options={[
            { value: "desc", label: sortDirectionLabel.desc },
            { value: "asc", label: sortDirectionLabel.asc },
          ]}
        />
      </TodoField>
    </section>
  );
}
