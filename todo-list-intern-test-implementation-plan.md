# Todo List Intern Developer Test - Implementation Plan

## 1. Mục tiêu bài test

Xây dựng một ứng dụng **Quản lý công việc (Todo List)** theo yêu cầu bài test intern developer.

Ứng dụng cần thể hiện được:

- Tư duy tổ chức source code rõ ràng.
- Khả năng xây dựng fullstack app cơ bản.
- Xử lý dữ liệu không hợp lệ.
- Thiết kế API sạch, dễ dùng.
- UI dễ thao tác, responsive.
- README hướng dẫn chạy dự án đầy đủ.

Không cần làm quá phức tạp như authentication, phân quyền, realtime, notification. Trọng tâm là một Todo app nhỏ nhưng hoàn chỉnh, dễ chạy, dễ đọc code và dễ bảo trì.

---

## 2. Tech stack sử dụng

### Frontend

Sử dụng:

- Next.js
- TypeScript
- TailwindCSS
- shadcn/ui
- TanStack Query
- React Hook Form
- Zod
- Axios
- Lucide React

Vai trò:

| Công nghệ | Vai trò |
|---|---|
| Next.js | Xây dựng giao diện frontend |
| TypeScript | Type safety |
| TailwindCSS | Styling nhanh, responsive |
| shadcn/ui | Component UI hiện đại |
| TanStack Query | Fetch/cache/mutation API |
| React Hook Form | Quản lý form |
| Zod | Validate form phía client |
| Axios | Gọi API backend |
| Lucide React | Icon |

### Backend

Sử dụng:

- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- PostgreSQL
- Bean Validation
- Lombok
- MapStruct
- Springdoc OpenAPI / Swagger
- JUnit 5
- Mockito

Vai trò:

| Công nghệ | Vai trò |
|---|---|
| Spring Boot | Backend framework |
| Spring Web | Xây dựng REST API |
| Spring Data JPA | Làm việc với database |
| PostgreSQL | Lưu dữ liệu todo |
| Bean Validation | Validate request DTO |
| Lombok | Giảm boilerplate |
| MapStruct | Map Entity sang DTO |
| Swagger/OpenAPI | Tài liệu API |
| JUnit + Mockito | Unit test |

### DevOps / Tooling

Sử dụng:

- Docker Compose cho PostgreSQL.
- `.env.example` cho frontend/backend.
- README hướng dẫn chạy.
- GitHub repository.
- Deploy nếu còn thời gian.

---

## 3. Kiến trúc tổng thể

Dự án nên tách frontend và backend rõ ràng.

```txt
todo-list-app/
├── todo-frontend/
├── todo-backend/
├── docker-compose.yml
├── README.md
└── .gitignore
```

Flow tổng thể:

```txt
User
→ Next.js UI
→ TanStack Query / Axios
→ Spring Boot REST API
→ Service Layer
→ Repository
→ PostgreSQL
```

Nguyên tắc:

- Frontend chỉ xử lý UI, form, gọi API.
- Backend xử lý business logic, validation, pagination, search, filter, sort.
- Database chỉ lưu dữ liệu.
- Không expose Entity trực tiếp ra ngoài API.
- Dùng DTO cho request/response.
- Dùng Global Exception Handler để format lỗi thống nhất.

---

## 4. Scope chức năng

### Chức năng bắt buộc

Ứng dụng phải có:

- Hiển thị danh sách công việc.
- Thêm công việc mới.
- Chỉnh sửa công việc.
- Xóa công việc.
- Đánh dấu hoàn thành / chưa hoàn thành.
- Cho phép tìm kiếm hoặc lọc theo trạng thái.

### Chức năng khuyến khích nên làm

Nên làm thêm các chức năng sau nếu kịp:

- Tìm kiếm theo title hoặc description.
- Lọc theo trạng thái:
  - All
  - Pending
  - Completed
- Lọc theo priority:
  - LOW
  - MEDIUM
  - HIGH
- Sắp xếp theo:
  - createdAt
  - updatedAt
  - dueDate
  - priority
  - title
- Phân trang.
- Responsive UI.
- Docker Compose cho PostgreSQL.
- Swagger API docs.
- Unit test backend service.
- Deploy online.

### Không nên làm

Không nên thêm các phần sau vì dễ quá scope trong 2 ngày:

- Login/register.
- Role/permission.
- Workspace.
- Realtime.
- Notification.
- Multi-user.
- Drag and drop phức tạp.

---

## 5. Data model

Entity chính: `Todo`.

### Todo fields

```txt
Todo
├── id: UUID
├── title: String
├── description: String?
├── completed: Boolean
├── priority: TodoPriority
├── dueDate: LocalDate?
├── createdAt: LocalDateTime
└── updatedAt: LocalDateTime
```

### TodoPriority enum

```txt
LOW
MEDIUM
HIGH
```

### Database table

```txt
todos
├── id UUID PRIMARY KEY
├── title VARCHAR(255) NOT NULL
├── description TEXT
├── completed BOOLEAN NOT NULL DEFAULT false
├── priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM'
├── due_date DATE
├── created_at TIMESTAMP NOT NULL
└── updated_at TIMESTAMP NOT NULL
```

### Index nên có

```txt
completed
priority
created_at
updated_at
due_date
```

---

## 6. Backend API Design

Base URL:

```txt
/api/v1/todos
```

---

### 6.1. Get todos

Endpoint:

```http
GET /api/v1/todos
```

Query params:

```txt
search?: string
status?: all | pending | completed
priority?: LOW | MEDIUM | HIGH
page?: number
size?: number
sortBy?: createdAt | updatedAt | dueDate | priority | title
sortDirection?: asc | desc
```

Example:

```http
GET /api/v1/todos?search=report&status=pending&page=0&size=10&sortBy=createdAt&sortDirection=desc
```

Response:

```json
{
  "items": [
    {
      "id": "8fd8f41b-4c2c-4a7f-9b90-3b2f1a82e6ef",
      "title": "Finish internship test",
      "description": "Build Todo List app with Next.js and Spring Boot",
      "completed": false,
      "priority": "HIGH",
      "dueDate": "2026-07-07",
      "createdAt": "2026-07-05T10:30:00",
      "updatedAt": "2026-07-05T10:30:00"
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 1,
  "totalPages": 1
}
```

Backend phải xử lý:

- Nếu `page < 0` thì trả lỗi 400.
- Nếu `size <= 0` thì trả lỗi 400.
- Nếu `size > 50` thì giới hạn về 50 hoặc trả lỗi 400.
- Nếu `status` không hợp lệ thì trả lỗi 400.
- Nếu `sortBy` không hợp lệ thì fallback về `createdAt` hoặc trả lỗi 400.
- Nếu không truyền gì thì mặc định:
  - page = 0
  - size = 10
  - sortBy = createdAt
  - sortDirection = desc

---

### 6.2. Create todo

Endpoint:

```http
POST /api/v1/todos
```

Request body:

```json
{
  "title": "Learn Spring Boot",
  "description": "Practice REST API",
  "priority": "MEDIUM",
  "dueDate": "2026-07-08"
}
```

Validation:

```txt
title:
- required
- not blank
- max 255 characters

description:
- optional
- max 1000 characters

priority:
- optional
- must be LOW, MEDIUM, HIGH
- default MEDIUM

dueDate:
- optional
- valid date
```

Response status:

```txt
201 Created
```

Response body:

```json
{
  "id": "8fd8f41b-4c2c-4a7f-9b90-3b2f1a82e6ef",
  "title": "Learn Spring Boot",
  "description": "Practice REST API",
  "completed": false,
  "priority": "MEDIUM",
  "dueDate": "2026-07-08",
  "createdAt": "2026-07-05T10:30:00",
  "updatedAt": "2026-07-05T10:30:00"
}
```

---

### 6.3. Update todo

Endpoint:

```http
PUT /api/v1/todos/{id}
```

Request body:

```json
{
  "title": "Learn Spring Boot REST API",
  "description": "Practice CRUD and validation",
  "priority": "HIGH",
  "dueDate": "2026-07-08",
  "completed": false
}
```

Validation:

```txt
id:
- must be valid UUID
- todo must exist

title:
- required
- not blank
- max 255 characters

description:
- optional
- max 1000 characters

priority:
- required
- LOW, MEDIUM, HIGH

completed:
- required boolean
```

Response status:

```txt
200 OK
```

Nếu todo không tồn tại:

```txt
404 Not Found
```

---

### 6.4. Toggle todo completed

Endpoint:

```http
PATCH /api/v1/todos/{id}/toggle
```

Request body không bắt buộc.

Logic:

```txt
Nếu todo.completed = false → set true
Nếu todo.completed = true → set false
```

Response:

```json
{
  "id": "8fd8f41b-4c2c-4a7f-9b90-3b2f1a82e6ef",
  "title": "Learn Spring Boot REST API",
  "description": "Practice CRUD and validation",
  "completed": true,
  "priority": "HIGH",
  "dueDate": "2026-07-08",
  "createdAt": "2026-07-05T10:30:00",
  "updatedAt": "2026-07-05T11:00:00"
}
```

Nếu todo không tồn tại:

```txt
404 Not Found
```

---

### 6.5. Delete todo

Endpoint:

```http
DELETE /api/v1/todos/{id}
```

Response status:

```txt
204 No Content
```

Nếu todo không tồn tại:

```txt
404 Not Found
```

---

## 7. Error response format

Backend nên trả lỗi thống nhất.

### Validation error

```json
{
  "timestamp": "2026-07-05T10:30:00",
  "status": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

### Not found error

```json
{
  "timestamp": "2026-07-05T10:30:00",
  "status": 404,
  "message": "Todo not found"
}
```

### Internal server error

```json
{
  "timestamp": "2026-07-05T10:30:00",
  "status": 500,
  "message": "Internal server error"
}
```

---

## 8. Backend folder structure

```txt
todo-backend/
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/com/example/todo/
│   │   │   ├── TodoApplication.java
│   │   │   ├── common/
│   │   │   │   ├── exception/
│   │   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   │   ├── ResourceNotFoundException.java
│   │   │   │   │   └── BadRequestException.java
│   │   │   │   └── response/
│   │   │   │       ├── ErrorResponse.java
│   │   │   │       └── PageResponse.java
│   │   │   ├── config/
│   │   │   │   ├── CorsConfig.java
│   │   │   │   └── OpenApiConfig.java
│   │   │   └── todo/
│   │   │       ├── controller/
│   │   │       │   └── TodoController.java
│   │   │       ├── service/
│   │   │       │   ├── TodoService.java
│   │   │       │   └── TodoServiceImpl.java
│   │   │       ├── repository/
│   │   │       │   └── TodoRepository.java
│   │   │       ├── entity/
│   │   │       │   └── Todo.java
│   │   │       ├── dto/
│   │   │       │   ├── TodoCreateRequest.java
│   │   │       │   ├── TodoUpdateRequest.java
│   │   │       │   └── TodoResponse.java
│   │   │       ├── mapper/
│   │   │       │   └── TodoMapper.java
│   │   │       └── enums/
│   │   │           ├── TodoPriority.java
│   │   │           └── TodoStatus.java
│   │   └── resources/
│   │       ├── application.yml
│   │       └── application-dev.yml
│   └── test/
│       └── java/com/example/todo/
│           └── todo/
│               └── service/
│                   └── TodoServiceTest.java
└── README.md
```

---

## 9. Backend implementation flow

### Step 1: Create Spring Boot project

Dependencies:

```txt
Spring Web
Spring Data JPA
PostgreSQL Driver
Validation
Lombok
MapStruct
Springdoc OpenAPI
JUnit
Mockito
```

### Step 2: Configure database

Create `application.yml`:

```yml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/todo_db
    username: todo_user
    password: todo_password
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

server:
  port: 8080
```

### Step 3: Create Todo entity

Fields:

```txt
id
title
description
completed
priority
dueDate
createdAt
updatedAt
```

Use:

```txt
@PrePersist for createdAt, updatedAt
@PreUpdate for updatedAt
```

### Step 4: Create enum

Create:

```txt
TodoPriority: LOW, MEDIUM, HIGH
TodoStatus: ALL, PENDING, COMPLETED
```

### Step 5: Create DTOs

Create:

```txt
TodoCreateRequest
TodoUpdateRequest
TodoResponse
```

Validation rules must be placed on request DTOs.

### Step 6: Create repository

Create `TodoRepository extends JpaRepository<Todo, UUID>`.

For search/filter, either use:

- Spring Data JPA Specification, recommended.
- Custom JPQL query.
- Query by Example.

Recommended approach: use Specification for clean dynamic filtering.

### Step 7: Create service layer

Service methods:

```txt
PageResponse<TodoResponse> getTodos(TodoQueryParams params)
TodoResponse createTodo(TodoCreateRequest request)
TodoResponse updateTodo(UUID id, TodoUpdateRequest request)
TodoResponse toggleTodo(UUID id)
void deleteTodo(UUID id)
```

Business logic:

```txt
getTodos:
- validate query params
- build specification from search/status/priority
- build pageable from page/size/sortBy/sortDirection
- query repository
- map Page<Todo> to PageResponse<TodoResponse>

createTodo:
- trim title
- set completed = false
- set priority = request.priority or MEDIUM
- save
- return response

updateTodo:
- find todo by id
- if not found throw ResourceNotFoundException
- validate and update fields
- save
- return response

toggleTodo:
- find todo by id
- if not found throw ResourceNotFoundException
- completed = !completed
- save
- return response

deleteTodo:
- find todo by id
- if not found throw ResourceNotFoundException
- delete
```

### Step 8: Create controller

Endpoints:

```txt
GET    /api/v1/todos
POST   /api/v1/todos
PUT    /api/v1/todos/{id}
PATCH  /api/v1/todos/{id}/toggle
DELETE /api/v1/todos/{id}
```

Controller should only:

- Receive request.
- Validate request using `@Valid`.
- Call service.
- Return response.

No business logic in controller.

### Step 9: Create global exception handler

Handle:

```txt
MethodArgumentNotValidException
ConstraintViolationException
ResourceNotFoundException
BadRequestException
Exception
```

Return consistent error format.

### Step 10: Configure CORS

Allow frontend:

```txt
http://localhost:3000
```

### Step 11: Add Swagger

Swagger path should be available at:

```txt
http://localhost:8080/swagger-ui/index.html
```

### Step 12: Write unit tests

Minimum tests:

```txt
TodoServiceTest
├── create todo successfully
├── reject blank title
├── get todos with pagination
├── update todo successfully
├── throw not found when updating missing todo
├── toggle todo completed
├── delete todo successfully
└── throw not found when deleting missing todo
```

---

## 10. Frontend folder structure

```txt
todo-frontend/
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── .env.example
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── providers.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── todo/
│   │   │   ├── todo-list.tsx
│   │   │   ├── todo-item.tsx
│   │   │   ├── todo-form.tsx
│   │   │   ├── todo-dialog.tsx
│   │   │   ├── todo-filters.tsx
│   │   │   ├── todo-search.tsx
│   │   │   ├── todo-pagination.tsx
│   │   │   ├── todo-sort.tsx
│   │   │   └── empty-state.tsx
│   │   └── ui/
│   ├── hooks/
│   │   └── use-todos.ts
│   ├── lib/
│   │   ├── axios.ts
│   │   └── utils.ts
│   ├── services/
│   │   └── todo-api.ts
│   ├── schemas/
│   │   └── todo.schema.ts
│   └── types/
│       └── todo.ts
└── README.md
```

---

## 11. Frontend implementation flow

### Step 1: Create Next.js project

Use TypeScript and App Router.

### Step 2: Install dependencies

Install:

```txt
tailwindcss
shadcn/ui
@tanstack/react-query
axios
react-hook-form
zod
@hookform/resolvers
lucide-react
```

### Step 3: Configure environment

Create `.env.example`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

Create `src/lib/axios.ts`:

```txt
- Create Axios instance.
- baseURL from NEXT_PUBLIC_API_BASE_URL.
- Handle API error response.
```

### Step 4: Define frontend types

Create `src/types/todo.ts`.

Types:

```txt
Todo
TodoPriority
TodoStatus
TodoListResponse
TodoCreateInput
TodoUpdateInput
TodoQueryParams
```

### Step 5: Define validation schema

Create `src/schemas/todo.schema.ts`.

Rules:

```txt
title:
- required
- trim
- max 255

description:
- optional
- max 1000

priority:
- LOW / MEDIUM / HIGH

dueDate:
- optional date string
```

### Step 6: Create API service

Create `src/services/todo-api.ts`.

Functions:

```txt
getTodos(params)
createTodo(data)
updateTodo(id, data)
toggleTodo(id)
deleteTodo(id)
```

### Step 7: Setup TanStack Query provider

Create `src/app/providers.tsx`.

Wrap app with `QueryClientProvider`.

### Step 8: Create `useTodos` hook

Create `src/hooks/use-todos.ts`.

Hook responsibilities:

```txt
- useQuery for getTodos
- useMutation for createTodo
- useMutation for updateTodo
- useMutation for toggleTodo
- useMutation for deleteTodo
- invalidate todos query after mutation success
```

### Step 9: Build main page

`src/app/page.tsx` should contain:

```txt
State:
- search
- status
- priority
- page
- size
- sortBy
- sortDirection
- selectedTodo
- dialog open/close

Render:
- Header
- Search
- Filters
- Sort
- Add button
- Todo list
- Pagination
- Create/Edit dialog
```

### Step 10: Create UI components

Components:

```txt
todo-search.tsx:
- input search
- debounce optional

todo-filters.tsx:
- status filter
- priority filter

todo-sort.tsx:
- sortBy select
- sortDirection select

todo-list.tsx:
- render loading/error/empty state
- render list of todo-item

todo-item.tsx:
- checkbox completed
- title
- description
- priority badge
- due date
- edit button
- delete button

todo-dialog.tsx:
- open create/edit form

todo-form.tsx:
- React Hook Form
- Zod validation
- submit create/update

todo-pagination.tsx:
- previous/next
- page indicator
```

### Step 11: UI states

Handle:

```txt
Loading:
- Show skeleton or "Loading tasks..."

Empty:
- No tasks yet. Create your first task.

Search empty:
- No tasks found for your search.

Error:
- Show error message and retry button.

Delete confirm:
- Ask user before deleting.

Success:
- Show toast after create/update/delete/toggle.
```

### Step 12: Responsive UI

Desktop:

```txt
- Card/table width centered.
- Toolbar horizontal.
```

Mobile:

```txt
- Toolbar stacked vertically.
- Todo cards full width.
- Buttons easy to tap.
```

---

## 12. Frontend page flow

### Initial load flow

```txt
User opens app
→ Next.js renders page
→ useTodos calls GET /api/v1/todos
→ Backend returns paginated todos
→ UI displays list
```

### Search flow

```txt
User types search keyword
→ Frontend updates search state
→ Query key changes
→ TanStack Query calls GET /api/v1/todos?search=keyword
→ Backend filters by title/description
→ UI updates list
```

Optional: debounce search 300ms.

### Filter flow

```txt
User selects status Completed
→ Frontend sets status = completed
→ Reset page to 0
→ TanStack Query refetches
→ Backend returns completed todos
→ UI updates list
```

### Create flow

```txt
User clicks New Task
→ Open dialog
→ User fills form
→ Client validates using Zod
→ If valid, POST /api/v1/todos
→ Backend validates DTO
→ Backend saves todo
→ Frontend invalidates todos query
→ List refreshes
→ Close dialog
→ Show success toast
```

### Edit flow

```txt
User clicks Edit
→ Open dialog with existing todo data
→ User edits form
→ Client validates
→ PUT /api/v1/todos/{id}
→ Backend validates and updates
→ Frontend invalidates todos query
→ List refreshes
→ Close dialog
→ Show success toast
```

### Toggle completed flow

```txt
User clicks checkbox
→ PATCH /api/v1/todos/{id}/toggle
→ Backend flips completed value
→ Frontend invalidates todos query
→ UI updates completed state
```

Optional improvement: optimistic update.

### Delete flow

```txt
User clicks Delete
→ Show confirmation dialog
→ User confirms
→ DELETE /api/v1/todos/{id}
→ Backend deletes todo
→ Frontend invalidates todos query
→ UI updates list
→ Show success toast
```

### Pagination flow

```txt
User clicks Next page
→ Frontend increments page
→ Query key changes
→ GET /api/v1/todos?page=n
→ Backend returns corresponding page
→ UI displays new page
```

### Sort flow

```txt
User selects sortBy or sortDirection
→ Frontend updates sort params
→ Reset page to 0
→ GET /api/v1/todos?sortBy=updatedAt&sortDirection=desc
→ Backend sorts data
→ UI displays sorted list
```

---

## 13. Validation flow

### Client-side validation

```txt
User submits form
→ React Hook Form receives data
→ Zod validates data
→ If invalid:
    - show field-level error
    - do not call API
→ If valid:
    - call API
```

### Server-side validation

```txt
Backend receives request
→ @Valid validates DTO
→ If invalid:
    - GlobalExceptionHandler catches error
    - return 400 with field errors
→ If valid:
    - service handles business logic
```

### Not found flow

```txt
Request with missing todo id
→ Service calls repository.findById
→ If empty:
    - throw ResourceNotFoundException
→ GlobalExceptionHandler returns 404
```

---

## 14. Docker Compose

Create root `docker-compose.yml`:

```yml
services:
  postgres:
    image: postgres:16
    container_name: todo-postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: todo_user
      POSTGRES_PASSWORD: todo_password
      POSTGRES_DB: todo_db
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Optional later:

- Add backend Dockerfile.
- Add frontend Dockerfile.
- Add full docker compose for app + db.

For this intern test, Docker Compose for database is enough if time is limited.

---

## 15. README requirements

Root README should include:

```txt
# Todo List Intern Developer Test

## Overview
## Tech Stack
## Features
## Project Structure
## Backend Setup
## Frontend Setup
## Environment Variables
## Run with Docker
## API Documentation
## Testing
## Deployment
## Screenshots
## Design Decisions
```

### README - Overview example

```md
This is a Todo List application built for an Intern Developer test.
The project is implemented with Next.js for the frontend and Spring Boot for the backend.
It supports creating, updating, deleting, searching, filtering, sorting and paginating todos.
```

### README - Features example

```md
## Features

- View todo list
- Create new todo
- Update todo
- Delete todo
- Toggle completed/uncompleted
- Search by title or description
- Filter by status
- Filter by priority
- Sort todos
- Pagination
- Responsive UI
- API validation
- Global error handling
- Swagger API documentation
```

### README - Run backend

```bash
cd todo-backend
./mvnw spring-boot:run
```

Or on Windows:

```bash
cd todo-backend
mvn spring-boot:run
```

Backend runs at:

```txt
http://localhost:8080
```

Swagger:

```txt
http://localhost:8080/swagger-ui/index.html
```

### README - Run frontend

```bash
cd todo-frontend
npm install
npm run dev
```

Frontend runs at:

```txt
http://localhost:3000
```

### README - Run database

```bash
docker compose up -d
```

### README - Environment variables

Frontend `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

Backend `application.yml`:

```yml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/todo_db
    username: todo_user
    password: todo_password
```

### README - Design Decisions

```md
## Design Decisions

- The project is separated into frontend and backend to keep responsibilities clear.
- The backend follows Controller-Service-Repository structure for maintainability.
- DTOs are used to avoid exposing database entities directly.
- Input validation is handled on both client and server sides.
- Search, filter, sort and pagination are handled by the backend to keep the frontend simple.
- Global exception handling provides consistent error responses.
- PostgreSQL is used for reliable relational data storage.
- TanStack Query is used to manage server state and API cache on the frontend.
```

---

## 16. Unit test plan

Minimum backend tests:

```txt
TodoServiceTest
├── should create todo successfully
├── should set default completed false when creating todo
├── should set default priority medium when priority is missing
├── should return paginated todos
├── should search todos by keyword
├── should filter completed todos
├── should update todo successfully
├── should throw not found when updating missing todo
├── should toggle todo completed
├── should delete todo successfully
└── should throw not found when deleting missing todo
```

Optional controller tests:

```txt
TodoControllerTest
├── POST /api/v1/todos should return 201
├── POST /api/v1/todos with invalid body should return 400
├── GET /api/v1/todos should return paginated response
├── PUT /api/v1/todos/{id} should return 200
├── PATCH /api/v1/todos/{id}/toggle should return 200
└── DELETE /api/v1/todos/{id} should return 204
```

Frontend tests are optional.

If adding frontend tests, use:

```txt
Vitest
React Testing Library
```

Suggested frontend tests:

```txt
TodoForm
├── should show title required error
├── should submit valid form

TodoItem
├── should render todo title
├── should call toggle when checkbox clicked
```

---

## 17. Development timeline for 2 days

## Day 1 - Core backend + basic frontend

### Phase 1: Project setup

Tasks:

```txt
- Create GitHub repo.
- Create root folder.
- Create Spring Boot backend.
- Create Next.js frontend.
- Add Docker Compose for PostgreSQL.
- Add .gitignore.
- Add root README draft.
```

Expected result:

```txt
Both frontend and backend can start successfully.
Database runs with Docker Compose.
```

### Phase 2: Backend CRUD

Tasks:

```txt
- Create Todo entity.
- Create TodoPriority enum.
- Create Todo DTOs.
- Create TodoRepository.
- Create TodoService.
- Create TodoController.
- Add CRUD endpoints.
- Add toggle endpoint.
- Add validation.
- Add global exception handler.
- Add CORS config.
- Add Swagger.
```

Expected result:

```txt
All backend APIs work in Swagger/Postman.
```

### Phase 3: Frontend basic CRUD

Tasks:

```txt
- Setup TailwindCSS.
- Setup shadcn/ui.
- Setup Axios.
- Setup TanStack Query.
- Create Todo types.
- Create Todo API service.
- Create useTodos hook.
- Display todo list.
- Create todo form.
- Toggle completed.
- Delete todo.
```

Expected result:

```txt
User can create, view, toggle and delete todos from the UI.
```

---

## Day 2 - Edit/search/filter/sort/pagination + polish

### Phase 4: Complete frontend features

Tasks:

```txt
- Add edit todo dialog.
- Add search input.
- Add status filter.
- Add priority filter.
- Add sort dropdown.
- Add pagination.
```

Expected result:

```txt
User can fully manage todos and query data from UI.
```

### Phase 5: UI/UX polish

Tasks:

```txt
- Add loading state.
- Add empty state.
- Add search empty state.
- Add error state.
- Add delete confirmation.
- Add success/error toast.
- Make UI responsive.
- Improve spacing, badges and layout.
```

Expected result:

```txt
Application feels complete and user-friendly.
```

### Phase 6: Testing and documentation

Tasks:

```txt
- Write TodoService unit tests.
- Run backend tests.
- Check formatting.
- Complete README.
- Add .env.example files.
- Add screenshots.
- Add Swagger link in README.
```

Expected result:

```txt
Project is ready to submit.
```

### Phase 7: Deployment

Optional tasks:

```txt
- Deploy frontend to Vercel.
- Deploy backend to Render/Railway.
- Deploy database to Neon/Supabase/Railway PostgreSQL.
- Add deployed links to README.
```

Expected result:

```txt
Project has online demo link.
```

---

## 18. Final priority order

If time is limited, follow this order:

```txt
1. Backend CRUD
2. Frontend CRUD
3. Backend validation
4. Search/filter status
5. Edit todo
6. README
7. Responsive UI
8. Sort/pagination
9. Swagger
10. Docker Compose
11. Unit test
12. Deploy
```

Never sacrifice CRUD correctness and README for optional features.

---

## 19. Minimum acceptable submission

The minimum version should include:

```txt
- Next.js frontend
- Spring Boot backend
- PostgreSQL database
- View todo list
- Create todo
- Edit todo
- Delete todo
- Toggle completed/uncompleted
- Search or filter by status
- Basic validation
- README with setup instructions
- GitHub link
```

---

## 20. Strong submission version

The stronger version should include:

```txt
- All minimum features
- Search and filter both implemented
- Sort
- Pagination
- Priority and due date
- Responsive UI
- Loading/empty/error states
- Toast notifications
- Delete confirmation dialog
- Swagger API docs
- Docker Compose
- Unit tests for backend service
- Online deployment
```

---

## 21. Agent implementation checklist

Use this checklist to implement.

### Root

```txt
[ ] Create repository
[ ] Create todo-frontend folder
[ ] Create todo-backend folder
[ ] Create docker-compose.yml
[ ] Create root README.md
[ ] Create .gitignore
```

### Backend

```txt
[ ] Generate Spring Boot project
[ ] Add required dependencies
[ ] Configure PostgreSQL datasource
[ ] Create Todo entity
[ ] Create TodoPriority enum
[ ] Create TodoStatus enum
[ ] Create DTOs
[ ] Create mapper
[ ] Create repository
[ ] Create service interface
[ ] Create service implementation
[ ] Create controller
[ ] Implement GET /api/v1/todos
[ ] Implement POST /api/v1/todos
[ ] Implement PUT /api/v1/todos/{id}
[ ] Implement PATCH /api/v1/todos/{id}/toggle
[ ] Implement DELETE /api/v1/todos/{id}
[ ] Implement search/filter/sort/pagination
[ ] Add validation annotations
[ ] Add global exception handler
[ ] Add CORS config
[ ] Add Swagger config
[ ] Add unit tests
```

### Frontend

```txt
[ ] Generate Next.js project
[ ] Setup TailwindCSS
[ ] Setup shadcn/ui
[ ] Setup Axios
[ ] Setup TanStack Query
[ ] Create providers
[ ] Create Todo types
[ ] Create Zod schema
[ ] Create todo API service
[ ] Create useTodos hook
[ ] Create TodoSearch component
[ ] Create TodoFilters component
[ ] Create TodoSort component
[ ] Create TodoList component
[ ] Create TodoItem component
[ ] Create TodoDialog component
[ ] Create TodoForm component
[ ] Create TodoPagination component
[ ] Implement create todo
[ ] Implement edit todo
[ ] Implement delete todo
[ ] Implement toggle todo
[ ] Implement search
[ ] Implement filter
[ ] Implement sort
[ ] Implement pagination
[ ] Add loading state
[ ] Add empty state
[ ] Add error state
[ ] Add responsive UI
```

### Documentation

```txt
[ ] Complete README overview
[ ] Add tech stack
[ ] Add features
[ ] Add project structure
[ ] Add backend setup
[ ] Add frontend setup
[ ] Add Docker setup
[ ] Add env variables
[ ] Add API docs link
[ ] Add test command
[ ] Add screenshots
[ ] Add design decisions
[ ] Add deployment link if available
```

---

## 22. Notes for agent

Important implementation notes:

```txt
- Do not add authentication.
- Do not over-engineer the app.
- Keep code clean and readable.
- Keep controller thin.
- Put business logic in service.
- Validate on both frontend and backend.
- Use DTOs instead of exposing entity directly.
- Backend should handle search/filter/sort/pagination.
- Frontend should use TanStack Query for server state.
- Use clear error messages.
- Add README early, then update it while implementing.
- Make sure the project can run from README commands.
```

Final goal:

```txt
A small but complete Todo List application using Next.js, Spring Boot, PostgreSQL and TailwindCSS, with clean architecture, validation, CRUD, search/filter, README and optional bonus features.
```
