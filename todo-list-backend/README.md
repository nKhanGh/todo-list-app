# Todo List Backend

Backend Spring Boot cho ứng dụng quản lý công việc. API hỗ trợ CRUD todo, xóa mềm, đổi trạng thái, lịch sử trạng thái, thống kê, validation, response format thống nhất, CORS, Swagger và unit test.

## Công nghệ

- Java 21
- Spring Boot 4.1
- Spring Web MVC
- Spring Data JPA
- PostgreSQL
- Lombok
- MapStruct
- Springdoc OpenAPI
- JUnit 5
- Mockito

## Yêu cầu

- Java 21+
- Docker Desktop
- Maven hoặc Maven wrapper có sẵn trong project

## Chạy local

### 1. Chạy PostgreSQL

```bash
docker compose up -d
```

Database mặc định:

```text
url: jdbc:postgresql://localhost:5432/todo_db
username: todo_user
password: todo_password
```

### 2. Chạy backend

Linux/macOS:

```bash
./mvnw spring-boot:run
```

Windows PowerShell:

```powershell
.\mvnw.cmd spring-boot:run
```

API chạy tại:

```text
http://localhost:8080/api/v1
```

Swagger UI:

```text
http://localhost:8080/api/v1/swagger-ui.html
```

OpenAPI JSON:

```text
http://localhost:8080/api/v1/v3/api-docs
```

## Cấu hình chính

File cấu hình:

```text
src/main/resources/application.yml
```

Cấu hình hiện tại:

- Server port: `8080`
- Context path: `/api/v1`
- Database: PostgreSQL local
- Hibernate ddl-auto: `update`
- CORS cho `http://localhost:3000` và `http://localhost:5173`

## API endpoints

Base URL:

```text
/api/v1
```

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| GET | `/todos` | Lấy danh sách todo có phân trang, filter, sort |
| GET | `/todos/statistics` | Lấy thống kê tổng quan |
| GET | `/todos/{id}` | Lấy chi tiết todo kèm lịch sử trạng thái |
| POST | `/todos` | Tạo todo |
| PUT | `/todos/{id}` | Cập nhật todo |
| PATCH | `/todos/{id}/status` | Đổi trạng thái todo |
| DELETE | `/todos/{id}` | Xóa mềm todo |

## Query danh sách todo

Endpoint:

```text
GET /api/v1/todos
```

Query params:

| Param | Kiểu | Mô tả |
| --- | --- | --- |
| `search` | string | Tìm theo title hoặc description |
| `status` | enum | `TODO`, `IN_PROGRESS`, `DONE` |
| `priority` | enum | `LOW`, `MEDIUM`, `HIGH` |
| `includeCompleted` | boolean | `true` để hiện cả việc đã xong, `false` để ẩn `DONE` |
| `page` | number | Trang hiện tại, bắt đầu từ `0` |
| `size` | number | Số item mỗi trang |
| `sortBy` | string | `createdAt`, `updatedAt`, `dueDate`, `priority`, `status`, `title` |
| `sortDirection` | string | `asc`, `desc` |

Ví dụ:

```text
GET /api/v1/todos?page=0&size=10&status=TODO&priority=HIGH&includeCompleted=false&sortBy=createdAt&sortDirection=desc
```

## Request examples

Tạo todo:

```json
{
  "title": "Hoàn thành bài test",
  "description": "Kiểm tra backend, frontend và README",
  "priority": "HIGH",
  "dueDate": "2026-07-08T14:30:00"
}
```

Cập nhật todo:

```json
{
  "title": "Cập nhật giao diện",
  "description": "Làm lại filter và modal",
  "priority": "MEDIUM",
  "dueDate": "2026-07-09T09:15:00"
}
```

Đổi trạng thái:

```json
{
  "status": "IN_PROGRESS"
}
```

## Response format

Response thành công:

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Success",
  "data": {},
  "errors": null,
  "timestamp": "2026-07-05T15:30:00"
}
```

Response lỗi validation hoặc app exception cũng dùng cùng format, có `code`, `message`, `errors` nếu có lỗi theo field.

## Statistics response

Endpoint:

```text
GET /api/v1/todos/statistics
```

Ví dụ response:

```json
{
  "total": 8,
  "todo": 3,
  "inProgress": 2,
  "done": 3,
  "progress": 38
}
```

Statistics chỉ tính todo active, tức là todo có `deletedAt = null`.

## Trạng thái và mức ưu tiên

Statuses:

```text
TODO, IN_PROGRESS, DONE
```

Priorities:

```text
LOW, MEDIUM, HIGH
```

## Test

Chạy test:

```bash
./mvnw test
```

Windows PowerShell:

```powershell
.\mvnw.cmd test
```

Lưu ý: context test hiện dùng PostgreSQL theo `application.yml`, nên hãy chạy database trước:

```bash
docker compose up -d
```

Test hiện có:

- Spring context load test.
- Todo service unit tests với JUnit 5 và Mockito.
- Test CRUD behavior, validation, soft delete, status history và statistics.

## Dừng database local

```bash
docker compose down
```

Xóa volume database:

```bash
docker compose down -v
```
