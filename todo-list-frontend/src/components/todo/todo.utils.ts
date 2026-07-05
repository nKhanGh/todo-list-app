import type { TodoPriority, TodoStatus } from "@/types/todo";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function todayLabel() {
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(new Date());
}

export function formatDateTime(value?: string | null) {
  if (!value) {
    return "Chưa có hạn";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return `${pad(date.getDate())}/${pad(
    date.getMonth() + 1
  )}/${date.getFullYear()} ${pad(date.getHours())}:${pad(
    date.getMinutes()
  )}:${pad(date.getSeconds())}`;
}

export function toInputDateTime(value?: string | null) {
  return value ? value.slice(0, 19) : "";
}

export function statusTone(status: TodoStatus) {
  if (status === "DONE") {
    return "bg-[#CCFFCC] text-[#1f8f84]";
  }

  if (status === "IN_PROGRESS") {
    return "bg-[#FFFFCC] text-[#9b6418]";
  }

  return "bg-[#e8ddd6] text-[#6e5d55]";
}

export function priorityTone(priority: TodoPriority) {
  if (priority === "HIGH") {
    return "bg-[#f9e5e5] text-[#ff0000]";
  }

  if (priority === "LOW") {
    return "bg-[#daf9d9] text-[#4e924e]";
  }

  return "bg-[#c5dfff] text-[#006fff]";
}
