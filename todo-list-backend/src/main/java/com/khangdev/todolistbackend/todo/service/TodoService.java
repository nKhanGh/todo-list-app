package com.khangdev.todolistbackend.todo.service;

import com.khangdev.todolistbackend.todo.dto.request.TodoCreateRequest;
import com.khangdev.todolistbackend.todo.dto.response.TodoResponse;

public interface TodoService {

    TodoResponse createTodo(TodoCreateRequest request);
}
