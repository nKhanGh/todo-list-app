# Todo List App

Ứng dụng quản lý công việc theo đề bài Intern Developer. Dự án gồm backend Spring Boot và frontend Next.js.

## Tính năng

- Xem danh sách công việc.
- Thêm, sửa, xóa mềm công việc.
- Đổi trạng thái công việc: `TODO`, `IN_PROGRESS`, `DONE`.
- Theo dõi lịch sử thay đổi trạng thái.
- Tìm kiếm công việc.
- Lọc theo trạng thái và mức ưu tiên.
- Sắp xếp, phân trang.
- Thống kê tổng số công việc, số việc theo trạng thái và phần trăm hoàn thành.
- Giao diện responsive, tiếng Việt, có custom select, date-time picker, toast và scrollbar.
- Swagger API docs.
- Unit test backend với JUnit 5 và Mockito.

## Công nghệ

Backend:

- Java 21
- Spring Boot 4.1
- Spring Web MVC
- Spring Data JPA
- PostgreSQL
- Lombok
- MapStruct
- Springdoc OpenAPI
- JUnit 5, Mockito

Frontend:

- Next.js 16
- React 19
- TypeScript
- TanStack Query
- Axios
- Tailwind CSS
- shadcn/base-ui style components
- Sonner toast

## Cấu trúc thư mục

```text
todo-list-app
├── todo-list-backend
│   ├── docker-compose.yml
│   ├── pom.xml
│   └── src
├── todo-list-frontend
│   ├── package.json
│   └── src
└── README.md
```

## Yêu cầu môi trường

- Java 21+
- Maven hoặc Maven wrapper có sẵn trong backend
- Node.js 20+
- npm
- Docker Desktop để chạy PostgreSQL local

## Chạy nhanh toàn bộ dự án

### 1. Chạy PostgreSQL

```bash
cd todo-list-backend
docker compose up -d
```

PostgreSQL mặc định:

```text
host: localhost
port: 5432
database: todo_db
username: todo_user
password: todo_password
```

### 2. Chạy backend

Linux/macOS:

```bash
cd todo-list-backend
./mvnw spring-boot:run
```

Windows PowerShell:

```powershell
cd todo-list-backend
.\mvnw.cmd spring-boot:run
```

Backend chạy tại:

```text
http://localhost:8080/api/v1
```

Swagger UI:

```text
http://localhost:8080/api/v1/swagger-ui.html
```

### 3. Chạy frontend

Tạo file `.env.local` trong `todo-list-frontend`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

Chạy frontend:

```bash
cd todo-list-frontend
npm install
npm run dev
```

Frontend chạy tại:

```text
http://localhost:3000
```

## API chính

Base URL:

```text
http://localhost:8080/api/v1
```

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| GET | `/todos` | Lấy danh sách todo có phân trang, filter, sort |
| GET | `/todos/statistics` | Lấy thống kê todo |
| GET | `/todos/{id}` | Lấy chi tiết todo kèm lịch sử trạng thái |
| POST | `/todos` | Tạo todo |
| PUT | `/todos/{id}` | Cập nhật todo |
| PATCH | `/todos/{id}/status` | Đổi trạng thái todo |
| DELETE | `/todos/{id}` | Xóa mềm todo |

Ví dụ tạo todo:

```json
{
  "title": "Hoàn thành bài test",
  "description": "Kiểm tra backend, frontend và README",
  "priority": "HIGH",
  "dueDate": "2026-07-08T14:30:00"
}
```

Ví dụ đổi trạng thái:

```json
{
  "status": "IN_PROGRESS"
}
```

Ví dụ filter và sort:

```text
GET /api/v1/todos?page=0&size=10&status=TODO&priority=HIGH&includeCompleted=false&sortBy=createdAt&sortDirection=desc
```

## Kiểm tra chất lượng

Backend test:

```bash
cd todo-list-backend
./mvnw test
```

Windows PowerShell:

```powershell
cd todo-list-backend
.\mvnw.cmd test
```

Lưu ý: context test hiện dùng cấu hình PostgreSQL trong `application.yml`, nên hãy chạy `docker compose up -d` trước khi test backend.

Frontend lint/build:

```bash
cd todo-list-frontend
npm run lint
npm run build
```

## Docker build

Backend image:

```bash
cd todo-list-backend
docker build -t todo-list-backend .
```

Chạy backend image:

```bash
docker run --rm -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/todo_db \
  -e SPRING_DATASOURCE_USERNAME=todo_user \
  -e SPRING_DATASOURCE_PASSWORD=todo_password \
  -e CORS_ALLOWED_ORIGINS=http://localhost:3000 \
  todo-list-backend
```

Frontend image:

```bash
cd todo-list-frontend
docker build \
  --build-arg NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1 \
  -t todo-list-frontend .
```

Chạy frontend image:

```bash
docker run --rm -p 3000:3000 todo-list-frontend
```

Lưu ý: `NEXT_PUBLIC_API_BASE_URL` là biến public của Next.js, nên cần truyền lúc build image frontend.

## Dừng môi trường local

```bash
cd todo-list-backend
docker compose down
```

Xóa luôn volume database local:

```bash
docker compose down -v
```

## Ghi chú

- Backend dùng soft delete qua field `deletedAt`.
- Statistics được tính ở backend, không tính ở client, để không bị sai khi danh sách đang phân trang hoặc filter.
- Chế độ ẩn công việc đã hoàn thành được xử lý bằng query `includeCompleted=false` ở backend.
- Frontend dùng `NEXT_PUBLIC_API_BASE_URL` để cấu hình endpoint backend.

## Biến môi trường khi deploy

Backend đọc cấu hình từ biến môi trường, có thể xem mẫu tại:

```text
todo-list-backend/.env.example
```

Các biến quan trọng:

```env
PORT=8080
SPRING_DATASOURCE_URL=jdbc:postgresql://host:5432/database
SPRING_DATASOURCE_USERNAME=your_user
SPRING_DATASOURCE_PASSWORD=your_password
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

Frontend đọc API URL từ:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.com/api/v1
```
