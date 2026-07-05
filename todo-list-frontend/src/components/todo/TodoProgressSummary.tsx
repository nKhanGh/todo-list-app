import { Check } from "lucide-react";

type TodoProgressSummaryProps = {
  doneCount: number;
  inProgressCount: number;
  totalCount: number;
  progress: number;
  everythingDone: boolean;
};

export function TodoProgressSummary({
  doneCount,
  inProgressCount,
  totalCount,
  progress,
  everythingDone,
}: Readonly<TodoProgressSummaryProps>) {
  return (
    <section className="rounded-[1.7rem] bg-linear-to-r from-[#13766c] to-[#48d2c4] p-5 text-white shadow-[0_18px_36px_rgba(31,143,132,0.2)] sm:p-6">
      <div className="grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
        <div
          className="grid size-24 place-items-center rounded-full sm:size-28"
          style={{
            background: `conic-gradient(#b9efe4 ${progress}%, rgba(21,78,72,0.45) 0)`,
          }}
        >
          <div className="grid size-16 place-items-center rounded-full bg-[#13766c] sm:size-20">
            {everythingDone ? (
              <Check className="size-9" strokeWidth={3} />
            ) : (
              <span className="text-2xl font-black">{progress}%</span>
            )}
          </div>
        </div>

        <div className="min-w-0">
          <p className="text-lg font-semibold">
            {everythingDone ? "Mọi việc đã xong" : "Gần xong rồi, tiếp tục nhé."}
          </p>
          <p className="mt-1 max-w-xl text-sm text-white/80">
            Theo dõi danh sách hiện tại, đổi trạng thái nhanh và luôn thấy rõ
            hạn hoàn thành.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:min-w-72">
          <div>
            <p className="text-2xl font-black">
              {doneCount} / {totalCount || 0}
            </p>
            <p className="mt-1 text-xs text-white/80">Công việc</p>
          </div>
          <div>
            <p className="text-2xl font-black">{inProgressCount}</p>
            <p className="mt-1 text-xs text-white/80">Đang làm</p>
          </div>
          <div>
            <p className="text-2xl font-black">{progress}%</p>
            <p className="mt-1 text-xs text-white/80">Hoàn thành</p>
          </div>
        </div>
      </div>
    </section>
  );
}
