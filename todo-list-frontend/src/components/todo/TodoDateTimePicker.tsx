import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import { TodoSelectField } from "./TodoSelectField";
import { formatDateTime } from "./todo.utils";

type TodoDateTimePickerProps = {
  value?: string | null;
  onChange: (value: string) => void;
};

const weekdays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const monthFormatter = new Intl.DateTimeFormat("vi-VN", {
  month: "long",
  year: "numeric",
});
function pad(value: number) {
  return String(value).padStart(2, "0");
}

function parseDateTime(value?: string | null) {
  if (!value) {
    return null;
  }

  const normalized = value.length === 16 ? `${value}:00` : value;
  const date = new Date(normalized);

  return Number.isNaN(date.getTime()) ? null : date;
}

function toDateTimeValue(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds()
  )}`;
}

function getCalendarDays(month: Date) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = new Date(year, monthIndex, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  return [
    ...Array.from({ length: startOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
}

function sameDay(left: Date | null, right: Date) {
  return (
    left?.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function buildTimeOptions(max: number) {
  return Array.from({ length: max + 1 }, (_, value) => ({
    value: pad(value),
    label: pad(value),
  }));
}

export function TodoDateTimePicker({ value, onChange }: Readonly<TodoDateTimePickerProps>) {
  const selectedDate = parseDateTime(value);
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(selectedDate ?? new Date());

  const calendarDays = useMemo(
    () => getCalendarDays(visibleMonth),
    [visibleMonth]
  );
  const displayValue = selectedDate
    ? formatDateTime(value)
    : "Chọn ngày và giờ";

  const updateDate = (nextDate: Date) => {
    onChange(toDateTimeValue(nextDate));
  };

  const selectDay = (day: number) => {
    const base = selectedDate ?? new Date();
    updateDate(
      new Date(
        visibleMonth.getFullYear(),
        visibleMonth.getMonth(),
        day,
        base.getHours(),
        base.getMinutes(),
        base.getSeconds()
      )
    );
  };

  const updateTime = (part: "hour" | "minute" | "second", nextValue: number) => {
    const base = selectedDate ?? new Date();
    const nextDate = new Date(base);

    if (!selectedDate) {
      nextDate.setFullYear(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
    }

    if (part === "hour") {
      nextDate.setHours(nextValue);
    }

    if (part === "minute") {
      nextDate.setMinutes(nextValue);
    }

    if (part === "second") {
      nextDate.setSeconds(nextValue);
    }

    updateDate(nextDate);
  };

  const moveMonth = (step: number) => {
    setVisibleMonth(
      (current) => new Date(current.getFullYear(), current.getMonth() + step, 1)
    );
  };

  const selectToday = () => {
    const now = new Date();
    setVisibleMonth(now);
    updateDate(now);
  };

  const clearValue = () => {
    onChange("");
    setOpen(false);
  };

  return (
    <div className="relative min-w-0">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-11 w-full min-w-0 items-center justify-between gap-2 rounded-2xl border border-[#dfd1c9] bg-white px-3 text-left text-sm font-semibold text-[#2f2521] outline-none transition hover:border-[#cbb8ae] focus:border-[#1f8f84] focus:ring-4 focus:ring-[#bfe8df]"
      >
        <span className="flex min-w-0 items-center gap-2 truncate">
          <CalendarDays className="size-4 shrink-0 text-[#8a7468]" />
          <span className="truncate">{displayValue}</span>
        </span>
        <Clock className="size-4 shrink-0 text-[#8a7468]" />
      </button>

      {open && (
        <div className="absolute bottom-[calc(100%+0.5rem)] right-0 right:0 xl:left-[calc(100%+1.75rem)] xl:-bottom-22.5 z-50  xl:w-[min(20rem,calc(100vw))] rounded-[1.35rem] border border-[#dfd1c9] bg-[#fffaf6] p-3 text-[#34251e] shadow-[0_22px_54px_rgba(70,37,21,0.22)]">
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => moveMonth(-1)}
              className="grid size-6 xl:size-9 place-items-center rounded-full bg-[#f3ece7] text-[#6b4a38] transition hover:bg-[#eadbd2]"
            >
              <ChevronLeft className="size-4" />
            </button>
            <p className="text-sm font-black capitalize text-[#243040]">
              {monthFormatter.format(visibleMonth)}
            </p>
            <button
              type="button"
              onClick={() => moveMonth(1)}
              className="grid size-6 xl:size-9 place-items-center rounded-full bg-[#f3ece7] text-[#6b4a38] transition hover:bg-[#eadbd2]"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 xl:gap-1 text-center">
            {weekdays.map((weekday) => (
              <div
                key={weekday}
                className=" text-[11px] font-black text-[#8a7468]"
              >
                {weekday}
              </div>
            ))}

            {calendarDays.map((day, index) => {
              const date = day
                ? new Date(
                    visibleMonth.getFullYear(),
                    visibleMonth.getMonth(),
                    day
                  )
                : null;
              const selected = date ? sameDay(selectedDate, date) : false;

              return day ? (
                <button
                  key={`${day}-${index}`}
                  type="button"
                  onClick={() => selectDay(day)}
                  className={`grid aspect-square place-items-center rounded-full text-sm font-extrabold transition ${
                    selected
                      ? "bg-[#1f8f84] text-white shadow-[0_8px_18px_rgba(31,143,132,0.24)]"
                      : "text-[#4b3b32] hover:bg-[#e1f4ee] hover:text-[#1f8f84]"
                  }`}
                >
                  {day}
                </button>
              ) : (
                <div key={`blank-${index}`} />
              );
            })}
          </div>

          <div className="mt-4 rounded-2xl bg-white p-3 ring-1 ring-[#eee5df]">
            <p className="mb-2 text-xs font-black text-[#8a7468]">Thời gian</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Giờ", part: "hour" as const, max: 23 },
                { label: "Phút", part: "minute" as const, max: 59 },
                { label: "Giây", part: "second" as const, max: 59 },
              ].map((item) => (
                <label
                  key={item.part}
                  className="grid gap-1 text-[11px] font-black text-[#8a7468]"
                >
                  {item.label}
                  <TodoSelectField
                    value={
                      item.part === "hour"
                        ? pad(selectedDate?.getHours() ?? new Date().getHours())
                        : item.part === "minute"
                          ? pad(selectedDate?.getMinutes() ?? 0)
                          : pad(selectedDate?.getSeconds() ?? 0)
                    }
                    onChange={(nextValue) =>
                      updateTime(item.part, Number(nextValue))
                    }
                    options={buildTimeOptions(item.max)}
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={clearValue}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-[#f3ece7] text-sm font-extrabold text-[#6b4a38]"
            >
              <X className="size-4" />
              Xóa hạn
            </button>
            <button
              type="button"
              onClick={selectToday}
              className="h-10 rounded-2xl bg-[#1f8f84] text-sm font-extrabold text-white"
            >
              Hôm nay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
