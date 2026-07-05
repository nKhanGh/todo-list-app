# Todo List Frontend

Frontend Next.js cho ứng dụng quản lý công việc. Giao diện tiếng Việt, responsive, dùng API từ backend Spring Boot.

## Công nghệ

- Next.js 16
- React 19
- TypeScript
- TanStack Query
- Axios
- Tailwind CSS
- shadcn/base-ui style components
- Lucide React icons
- Sonner toast

## Tính năng giao diện

- Xem danh sách công việc.
- Tìm kiếm, lọc theo trạng thái và mức ưu tiên.
- Ẩn/hiện công việc đã hoàn thành bằng API query, không filter thủ công ở client.
- Sắp xếp theo ngày tạo, ngày cập nhật, hạn hoàn thành, ưu tiên, trạng thái, tiêu đề.
- Tạo mới công việc.
- Chỉnh sửa công việc.
- Đổi trạng thái trực tiếp từ status badge.
- Xóa mềm công việc.
- Xem chi tiết công việc và timeline trạng thái.
- Hiển thị thống kê từ backend: tổng số, đang làm, hoàn thành, phần trăm tiến độ.
- Custom select, date-time picker, toast và scrollbar theo màu hệ thống.

## Yêu cầu

- Node.js 20+
- npm
- Backend chạy tại `http://localhost:8080/api/v1`

## Cài đặt

```bash
npm install
```

## Cấu hình môi trường

Tạo file `.env.local` trong thư mục `todo-list-frontend`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

Có thể tham khảo file:

```text
.env.example
```

## Chạy development

```bash
npm run dev
```

Frontend chạy tại:

```text
http://localhost:3000
```

## Build production

```bash
npm run build
```

Chạy bản production sau khi build:

```bash
npm run start
```

## Lint

```bash
npm run lint
```

## Cấu trúc chính

```text
src
├── app
│   ├── page.tsx
│   ├── provider.tsx
│   └── globals.css
├── components
│   ├── todo
│   └── ui
├── hooks
│   └── useTodo.ts
├── lib
│   └── axios.ts
├── services
│   └── todo.service.ts
└── types
    ├── api.ts
    └── todo.ts
```

## API sử dụng

Frontend gọi các endpoint:

| Method | Endpoint | Mục đích |
| --- | --- | --- |
| GET | `/todos` | Lấy danh sách todo |
| GET | `/todos/statistics` | Lấy thống kê |
| GET | `/todos/{id}` | Lấy chi tiết todo |
| POST | `/todos` | Tạo todo |
| PUT | `/todos/{id}` | Cập nhật todo |
| PATCH | `/todos/{id}/status` | Đổi trạng thái |
| DELETE | `/todos/{id}` | Xóa mềm todo |

## Ghi chú

- `page.tsx` giữ state và handler chính.
- Các phần UI todo được tách trong `src/components/todo`.
- Statistics được lấy từ backend qua `useTodoStatistics()`, không tự tính từ page hiện tại ở client.
- Nút ẩn/hiện việc đã xong cập nhật `includeCompleted` trong query list todo.
- Sau khi create/update/change status/delete, TanStack Query sẽ invalidate cả list và statistics.
