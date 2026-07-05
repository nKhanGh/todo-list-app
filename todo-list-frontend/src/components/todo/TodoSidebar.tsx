type TodoSidebarProps = {
  todoCount: number;
  inProgressCount: number;
  doneCount: number;
};

export function TodoSidebar({
  todoCount,
  inProgressCount,
  doneCount,
}: Readonly<TodoSidebarProps>) {
  return (
    <aside className="grid gap-4">
      <section className="rounded-[1.7rem] bg-[#fbf7f3] p-5 shadow-[0_18px_45px_rgba(70,37,21,0.1)] ring-1 ring-white/70">
        <h3 className="text-base font-black text-[#4d5968]">Tổng quan</h3>
        <div className="mt-4 grid gap-3">
          <div className="flex items-center justify-between rounded-2xl bg-white p-4 ring-1 ring-[#eee5df]">
            <span className="text-sm font-bold text-[#7d858f]">Cần làm</span>
            <strong className="text-2xl text-[#6e5d55]">{todoCount}</strong>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-white p-4 ring-1 ring-[#eee5df]">
            <span className="text-sm font-bold text-[#7d858f]">Đang làm</span>
            <strong className="text-2xl text-[#bb7a21]">
              {inProgressCount}
            </strong>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-white p-4 ring-1 ring-[#eee5df]">
            <span className="text-sm font-bold text-[#7d858f]">Hoàn thành</span>
            <strong className="text-2xl text-[#1f8f84]">{doneCount}</strong>
          </div>
        </div>
      </section>
    </aside>
  );
}
