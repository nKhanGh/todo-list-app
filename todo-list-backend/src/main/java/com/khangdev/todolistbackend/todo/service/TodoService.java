package com.khangdev.todolistbackend.todo.service;

import com.khangdev.todolistbackend.common.response.PageResponse;
import com.khangdev.todolistbackend.todo.dto.request.TodoCreateRequest;
import com.khangdev.todolistbackend.todo.dto.request.TodoQueryRequest;
import com.khangdev.todolistbackend.todo.dto.response.TodoResponse;

public interface TodoService {

    PageResponse<TodoResponse> getTodos(TodoQueryRequest request);

    TodoResponse createTodo(TodoCreateRequest request);
}
