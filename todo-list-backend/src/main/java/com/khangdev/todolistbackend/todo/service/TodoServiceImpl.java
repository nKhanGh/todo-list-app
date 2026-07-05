package com.khangdev.todolistbackend.todo.service;

import com.khangdev.todolistbackend.common.exception.AppException;
import com.khangdev.todolistbackend.common.exception.ErrorCode;
import com.khangdev.todolistbackend.todo.dto.request.TodoCreateRequest;
import com.khangdev.todolistbackend.todo.dto.response.TodoResponse;
import com.khangdev.todolistbackend.todo.entity.Todo;
import com.khangdev.todolistbackend.todo.entity.TodoStatusHistory;
import com.khangdev.todolistbackend.todo.enums.TodoPriority;
import com.khangdev.todolistbackend.todo.enums.TodoStatus;
import com.khangdev.todolistbackend.todo.mapper.TodoMapper;
import com.khangdev.todolistbackend.todo.repository.TodoRepository;
import com.khangdev.todolistbackend.todo.repository.TodoStatusHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TodoServiceImpl implements TodoService {

    private final TodoRepository todoRepository;

    private final TodoStatusHistoryRepository todoStatusHistoryRepository;

    private final TodoMapper todoMapper;

    @Override
    @Transactional
    public TodoResponse createTodo(TodoCreateRequest request) {
        String title = normalizeTitle(request.getTitle());
        TodoPriority priority = request.getPriority() == null ? TodoPriority.MEDIUM : request.getPriority();

        Todo todo = Todo.builder()
                .title(title)
                .description(request.getDescription())
                .priority(priority)
                .status(TodoStatus.TODO)
                .dueDate(request.getDueDate())
                .build();

        Todo savedTodo = todoRepository.save(todo);
        createInitialStatusHistory(savedTodo);

        return todoMapper.toResponse(savedTodo);
    }

    private String normalizeTitle(String title) {
        if (title == null || title.isBlank()) {
            throw new AppException(ErrorCode.VALIDATION_FAILED, "Title is required");
        }

        return title.trim();
    }

    private void createInitialStatusHistory(Todo todo) {
        TodoStatusHistory history = TodoStatusHistory.builder()
                .todo(todo)
                .toStatus(todo.getStatus())
                .build();

        todoStatusHistoryRepository.save(history);
    }
}
