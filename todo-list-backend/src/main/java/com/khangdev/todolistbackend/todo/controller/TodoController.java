package com.khangdev.todolistbackend.todo.controller;

import com.khangdev.todolistbackend.common.response.ApiResponse;
import com.khangdev.todolistbackend.common.response.PageResponse;
import com.khangdev.todolistbackend.todo.dto.request.TodoCreateRequest;
import com.khangdev.todolistbackend.todo.dto.request.TodoQueryRequest;
import com.khangdev.todolistbackend.todo.dto.request.TodoStatusUpdateRequest;
import com.khangdev.todolistbackend.todo.dto.request.TodoUpdateRequest;
import com.khangdev.todolistbackend.todo.dto.response.TodoDetailResponse;
import com.khangdev.todolistbackend.todo.dto.response.TodoResponse;
import com.khangdev.todolistbackend.todo.service.TodoService;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/todos")
@RequiredArgsConstructor
public class TodoController {

    private final TodoService todoService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<TodoResponse>>> getTodos(
            @Valid @ModelAttribute TodoQueryRequest request
    ) {
        PageResponse<TodoResponse> response = todoService.getTodos(request);

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TodoDetailResponse>> getTodo(@PathVariable UUID id) {
        TodoDetailResponse response = todoService.getTodo(id);

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TodoResponse>> createTodo(@Valid @RequestBody TodoCreateRequest request) {
        TodoResponse response = todoService.createTodo(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Todo created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TodoResponse>> updateTodo(
            @PathVariable UUID id,
            @Valid @RequestBody TodoUpdateRequest request
    ) {
        TodoResponse response = todoService.updateTodo(id, request);

        return ResponseEntity.ok(ApiResponse.success(response, "Todo updated successfully"));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TodoResponse>> updateTodoStatus(
            @PathVariable UUID id,
            @Valid @RequestBody TodoStatusUpdateRequest request
    ) {
        TodoResponse response = todoService.updateTodoStatus(id, request);

        return ResponseEntity.ok(ApiResponse.success(response, "Todo status updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTodo(@PathVariable UUID id) {
        todoService.deleteTodo(id);

        return ResponseEntity.ok(ApiResponse.success(null, "Todo deleted successfully"));
    }
}
