# Todo List Backend

Spring Boot backend for a todo list application. It provides todo CRUD APIs, soft delete, status tracking history, validation, common response formatting, Swagger API docs, CORS config, and unit tests.

## Tech Stack

- Java 21
- Spring Boot 4.1
- Spring Web MVC
- Spring Data JPA
- PostgreSQL
- Lombok
- MapStruct
- Springdoc OpenAPI
- JUnit 5 and Mockito

## Requirements

- Java 21+
- Docker Desktop
- Maven, or use the included Maven wrapper

## Run Locally

Start PostgreSQL:

```bash
docker compose up -d
```

Run the application:

```bash
./mvnw spring-boot:run
```

On Windows PowerShell:

```powershell
.\mvnw.cmd spring-boot:run
```

The API runs at:

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

## Database Config

Default PostgreSQL config in `src/main/resources/application.yml`:

```yml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/todo_db
    username: todo_user
    password: todo_password
```

The local database is provided by `docker-compose.yml`.

## API Endpoints

Base URL:

```text
/api/v1
```

Todo endpoints:

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/todos` | Get paginated todo list |
| GET | `/todos/{id}` | Get todo detail with status history |
| POST | `/todos` | Create todo |
| PUT | `/todos/{id}` | Update todo |
| PATCH | `/todos/{id}/status` | Change todo status |
| DELETE | `/todos/{id}` | Soft delete todo |

Supported statuses:

```text
TODO, IN_PROGRESS, DONE
```

Supported priorities:

```text
LOW, MEDIUM, HIGH
```

## Request Examples

Create todo:

```json
{
  "title": "Submit intern test",
  "description": "Finish backend and frontend",
  "priority": "HIGH",
  "dueDate": "2026-07-08T14:30:00"
}
```

Change status:

```json
{
  "status": "IN_PROGRESS"
}
```

List todos with filters:

```text
GET /api/v1/todos?page=0&size=10&status=TODO&priority=HIGH&sortBy=createdAt&sortDirection=desc
```

## Response Format

Successful responses use a common wrapper:

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

Validation and application errors are also returned in a consistent format with `code`, `message`, and optional field errors.

## Run Tests

```bash
./mvnw test
```

On Windows PowerShell:

```powershell
.\mvnw.cmd test
```

Current tests include:

- Spring context load test
- Todo service unit tests with JUnit 5 and Mockito

## Useful Commands

Stop PostgreSQL:

```bash
docker compose down
```

Stop PostgreSQL and remove local database volume:

```bash
docker compose down -v
```
