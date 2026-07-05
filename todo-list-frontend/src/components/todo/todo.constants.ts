import type {
  TodoCreateRequest,
  TodoPriority,
  TodoSortBy,
  TodoStatus,
} from "@/types/todo";

export const todoStatuses: TodoStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

export const todoPriorities: TodoPriority[] = ["LOW", "MEDIUM", "HIGH"];

export const statusLabel: Record<TodoStatus, string> = {
  TODO: "Cần làm",
  IN_PROGRESS: "Đang làm",
  DONE: "Hoàn thành",
};

export const priorityLabel: Record<TodoPriority, string> = {
  LOW: "Thấp",
  MEDIUM: "Trung bình",
  HIGH: "Cao",
};

export const sortLabel: Record<TodoSortBy, string> = {
  createdAt: "Ngày tạo",
  updatedAt: "Ngày cập nhật",
  dueDate: "Hạn hoàn thành",
  priority: "Mức ưu tiên",
  status: "Trạng thái",
  title: "Tiêu đề",
};

export const sortDirectionLabel: Record<"asc" | "desc", string> = {
  asc: "Tăng dần",
  desc: "Giảm dần",
};

export const filterLabel = {
  all: "Tất cả",
} as const;

export const emptyTodoForm: TodoCreateRequest = {
  title: "",
  description: "",
  priority: "MEDIUM",
  dueDate: "",
};
