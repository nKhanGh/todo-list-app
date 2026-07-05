package com.khangdev.todolistbackend.todo.service;

import com.khangdev.todolistbackend.common.response.PageResponse;
import com.khangdev.todolistbackend.todo.dto.request.TodoCreateRequest;
import com.khangdev.todolistbackend.todo.dto.request.TodoQueryRequest;
import com.khangdev.todolistbackend.todo.dto.response.TodoDetailResponse;
import com.khangdev.todolistbackend.todo.dto.response.TodoResponse;
import java.util.UUID;

public interface TodoService {

    PageResponse<TodoResponse> getTodos(TodoQueryRequest request);

    TodoDetailResponse getTodo(UUID id);

    TodoResponse createTodo(TodoCreateRequest request);
}
