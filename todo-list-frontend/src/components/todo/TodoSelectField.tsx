import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

type TodoSelectFieldProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
};

export function TodoSelectField<T extends string>({
  value,
  onChange,
  options,
}: Readonly<TodoSelectFieldProps<T>>) {
  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? value;

  return (
    <Select
      value={value}
      onValueChange={(nextValue) => {
        if (nextValue) {
          onChange(nextValue as T);
        }
      }}
    >
      <SelectTrigger className="h-11 w-full rounded-2xl border-[#ddcec5] bg-[#fffaf6] px-3 text-sm font-semibold text-[#34251e] shadow-none transition hover:border-[#cbb8ae] focus-visible:border-[#1f8f84] focus-visible:ring-[#bfe8df]">
        <span className="flex flex-1 text-left">{selectedLabel}</span>
      </SelectTrigger>
      <SelectContent
        align="start"
        alignItemWithTrigger={false}
        sideOffset={8}
        className="rounded-2xl border border-[#ddcec5] bg-[#fffaf6] p-1.5 text-[#34251e] shadow-[0_18px_45px_rgba(70,37,21,0.16)] ring-0"
      >
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="rounded-xl px-3 py-2.5 text-sm font-semibold text-[#34251e] focus:bg-[#d8f3ec] focus:text-[#1f8f84] data-highlighted:bg-[#d8f3ec]"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
