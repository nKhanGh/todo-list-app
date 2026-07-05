import type { ReactNode } from "react";

type TodoFieldProps = {
  label: string;
  children: ReactNode;
};

export function TodoField({ label, children }: Readonly<TodoFieldProps>) {
  return (
    <label className="grid min-w-0 gap-1.5 text-xs font-bold text-[#6b5a50]">
      {label}
      {children}
    </label>
  );
}
