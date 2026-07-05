package com.khangdev.todolistbackend.todo.service;

import com.khangdev.todolistbackend.common.response.PageResponse;
import com.khangdev.todolistbackend.todo.dto.request.TodoCreateRequest;
import com.khangdev.todolistbackend.todo.dto.request.TodoQueryRequest;
import com.khangdev.todolistbackend.todo.dto.request.TodoStatusUpdateRequest;
import com.khangdev.todolistbackend.todo.dto.request.TodoUpdateRequest;
import com.khangdev.todolistbackend.todo.dto.response.TodoDetailResponse;
import com.khangdev.todolistbackend.todo.dto.response.TodoResponse;
import com.khangdev.todolistbackend.todo.dto.response.TodoStatisticsResponse;
import java.util.UUID;

public interface TodoService {

    PageResponse<TodoResponse> getTodos(TodoQueryRequest request);

    TodoStatisticsResponse getStatistics();

    TodoDetailResponse getTodo(UUID id);

    TodoResponse createTodo(TodoCreateRequest request);

    TodoResponse updateTodo(UUID id, TodoUpdateRequest request);

    TodoResponse updateTodoStatus(UUID id, TodoStatusUpdateRequest request);

    void deleteTodo(UUID id);
}
