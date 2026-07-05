package com.khangdev.todolistbackend.todo.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.khangdev.todolistbackend.common.exception.AppException;
import com.khangdev.todolistbackend.common.exception.ErrorCode;
import com.khangdev.todolistbackend.common.response.PageResponse;
import com.khangdev.todolistbackend.todo.dto.request.TodoCreateRequest;
import com.khangdev.todolistbackend.todo.dto.request.TodoQueryRequest;
import com.khangdev.todolistbackend.todo.dto.request.TodoStatusUpdateRequest;
import com.khangdev.todolistbackend.todo.dto.request.TodoUpdateRequest;
import com.khangdev.todolistbackend.todo.dto.response.TodoDetailResponse;
import com.khangdev.todolistbackend.todo.dto.response.TodoResponse;
import com.khangdev.todolistbackend.todo.dto.response.TodoStatusHistoryResponse;
import com.khangdev.todolistbackend.todo.entity.Todo;
import com.khangdev.todolistbackend.todo.entity.TodoStatusHistory;
import com.khangdev.todolistbackend.todo.enums.TodoPriority;
import com.khangdev.todolistbackend.todo.enums.TodoStatus;
import com.khangdev.todolistbackend.todo.mapper.TodoMapper;
import com.khangdev.todolistbackend.todo.repository.TodoRepository;
import com.khangdev.todolistbackend.todo.repository.TodoStatusHistoryRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

@ExtendWith(MockitoExtension.class)
class TodoServiceImplTest {

    @Mock
    private TodoRepository todoRepository;

    @Mock
    private TodoStatusHistoryRepository todoStatusHistoryRepository;

    @Mock
    private TodoMapper todoMapper;

    @InjectMocks
    private TodoServiceImpl todoService;

    @Captor
    private ArgumentCaptor<Todo> todoCaptor;

    @Captor
    private ArgumentCaptor<TodoStatusHistory> historyCaptor;

    @Captor
    private ArgumentCaptor<Pageable> pageableCaptor;

    @Test
    @SuppressWarnings("unchecked")
    void getTodosShouldReturnMappedPageResponse() {
        TodoQueryRequest request = TodoQueryRequest.builder()
                .search("report")
                .status(TodoStatus.TODO)
                .priority(TodoPriority.HIGH)
                .page(1)
                .size(2)
                .sortBy("title")
                .sortDirection("asc")
                .build();
        Todo todo = todo("Write report", TodoStatus.TODO, TodoPriority.HIGH);
        TodoResponse mappedResponse = response(todo);
        PageRequest pageRequest = PageRequest.of(1, 2, Sort.by(Sort.Direction.ASC, "title"));

        when(todoRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(todo), pageRequest, 1));
        when(todoMapper.toResponse(todo)).thenReturn(mappedResponse);

        PageResponse<TodoResponse> result = todoService.getTodos(request);

        assertThat(result.getItems()).containsExactly(mappedResponse);
        assertThat(result.getPage()).isEqualTo(1);
        assertThat(result.getSize()).isEqualTo(2);
        assertThat(result.getTotalElements()).isEqualTo(3);
        assertThat(result.getTotalPages()).isEqualTo(2);
        verify(todoRepository).findAll(any(Specification.class), pageableCaptor.capture());
        assertThat(pageableCaptor.getValue().getSort())
                .isEqualTo(Sort.by(Sort.Direction.ASC, "title"));
    }

    @Test
    void getTodoShouldReturnDetailWithStatusHistories() {
        UUID id = UUID.randomUUID();
        Todo todo = todo(id, "Build API", TodoStatus.IN_PROGRESS, TodoPriority.MEDIUM);
        TodoStatusHistory history = TodoStatusHistory.builder()
                .todo(todo)
                .fromStatus(TodoStatus.TODO)
                .toStatus(TodoStatus.IN_PROGRESS)
                .build();
        TodoStatusHistoryResponse historyResponse = TodoStatusHistoryResponse.builder()
                .fromStatus(TodoStatus.TODO)
                .toStatus(TodoStatus.IN_PROGRESS)
                .build();
        TodoDetailResponse detailResponse = TodoDetailResponse.builder()
                .id(id)
                .title(todo.getTitle())
                .status(todo.getStatus())
                .priority(todo.getPriority())
                .build();

        when(todoRepository.findByIdAndDeletedAtIsNull(id)).thenReturn(Optional.of(todo));
        when(todoStatusHistoryRepository.findByTodoIdOrderByChangedAtAsc(id)).thenReturn(List.of(history));
        when(todoMapper.toHistoryResponses(List.of(history))).thenReturn(List.of(historyResponse));
        when(todoMapper.toDetailResponse(todo)).thenReturn(detailResponse);

        TodoDetailResponse result = todoService.getTodo(id);

        assertThat(result).isSameAs(detailResponse);
        assertThat(result.getStatusHistories()).containsExactly(historyResponse);
    }

    @Test
    void getTodoShouldThrowResourceNotFoundWhenTodoDoesNotExist() {
        UUID id = UUID.randomUUID();
        when(todoRepository.findByIdAndDeletedAtIsNull(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> todoService.getTodo(id))
                .isInstanceOfSatisfying(AppException.class, exception ->
                        assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.RESOURCE_NOT_FOUND))
                .hasMessage("Todo not found");
    }

    @Test
    void createTodoShouldTrimTitleDefaultPriorityAndCreateInitialHistory() {
        LocalDateTime dueDate = LocalDateTime.of(2026, 7, 8, 14, 30, 15);
        TodoCreateRequest request = TodoCreateRequest.builder()
                .title("  Learn tests  ")
                .description("Use Mockito and JUnit")
                .dueDate(dueDate)
                .build();
        TodoResponse mappedResponse = TodoResponse.builder()
                .title("Learn tests")
                .status(TodoStatus.TODO)
                .priority(TodoPriority.MEDIUM)
                .dueDate(dueDate)
                .build();

        when(todoRepository.save(any(Todo.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(todoMapper.toResponse(any(Todo.class))).thenReturn(mappedResponse);

        TodoResponse result = todoService.createTodo(request);

        assertThat(result).isSameAs(mappedResponse);
        verify(todoRepository).save(todoCaptor.capture());
        Todo savedTodo = todoCaptor.getValue();
        assertThat(savedTodo.getTitle()).isEqualTo("Learn tests");
        assertThat(savedTodo.getDescription()).isEqualTo("Use Mockito and JUnit");
        assertThat(savedTodo.getStatus()).isEqualTo(TodoStatus.TODO);
        assertThat(savedTodo.getPriority()).isEqualTo(TodoPriority.MEDIUM);
        assertThat(savedTodo.getDueDate()).isEqualTo(dueDate);

        verify(todoStatusHistoryRepository).save(historyCaptor.capture());
        TodoStatusHistory history = historyCaptor.getValue();
        assertThat(history.getTodo()).isSameAs(savedTodo);
        assertThat(history.getFromStatus()).isNull();
        assertThat(history.getToStatus()).isEqualTo(TodoStatus.TODO);
    }

    @Test
    void createTodoShouldThrowValidationFailedWhenTitleIsBlank() {
        TodoCreateRequest request = TodoCreateRequest.builder()
                .title("   ")
                .build();

        assertThatThrownBy(() -> todoService.createTodo(request))
                .isInstanceOfSatisfying(AppException.class, exception ->
                        assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.VALIDATION_FAILED))
                .hasMessage("Title is required");
        verify(todoRepository, never()).save(any(Todo.class));
        verify(todoStatusHistoryRepository, never()).save(any(TodoStatusHistory.class));
    }

    @Test
    void updateTodoShouldUpdateActiveTodoFields() {
        UUID id = UUID.randomUUID();
        LocalDateTime dueDate = LocalDateTime.of(2026, 7, 9, 9, 15, 0);
        Todo todo = todo(id, "Old title", TodoStatus.TODO, TodoPriority.LOW);
        TodoUpdateRequest request = TodoUpdateRequest.builder()
                .title("  New title  ")
                .description("New description")
                .priority(TodoPriority.HIGH)
                .dueDate(dueDate)
                .build();
        TodoResponse mappedResponse = TodoResponse.builder()
                .id(id)
                .title("New title")
                .priority(TodoPriority.HIGH)
                .dueDate(dueDate)
                .build();

        when(todoRepository.findByIdAndDeletedAtIsNull(id)).thenReturn(Optional.of(todo));
        when(todoRepository.save(any(Todo.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(todoMapper.toResponse(todo)).thenReturn(mappedResponse);

        TodoResponse result = todoService.updateTodo(id, request);

        assertThat(result).isSameAs(mappedResponse);
        verify(todoRepository).save(todoCaptor.capture());
        Todo savedTodo = todoCaptor.getValue();
        assertThat(savedTodo.getTitle()).isEqualTo("New title");
        assertThat(savedTodo.getDescription()).isEqualTo("New description");
        assertThat(savedTodo.getPriority()).isEqualTo(TodoPriority.HIGH);
        assertThat(savedTodo.getDueDate()).isEqualTo(dueDate);
        assertThat(savedTodo.getStatus()).isEqualTo(TodoStatus.TODO);
    }

    @Test
    void updateTodoStatusShouldCreateHistoryWhenStatusChanged() {
        UUID id = UUID.randomUUID();
        Todo todo = todo(id, "Change status", TodoStatus.TODO, TodoPriority.MEDIUM);
        TodoStatusUpdateRequest request = TodoStatusUpdateRequest.builder()
                .status(TodoStatus.IN_PROGRESS)
                .build();

        when(todoRepository.findByIdAndDeletedAtIsNull(id)).thenReturn(Optional.of(todo));
        when(todoRepository.save(any(Todo.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(todoMapper.toResponse(todo)).thenReturn(response(todo));

        todoService.updateTodoStatus(id, request);

        verify(todoRepository).save(todoCaptor.capture());
        assertThat(todoCaptor.getValue().getStatus()).isEqualTo(TodoStatus.IN_PROGRESS);

        verify(todoStatusHistoryRepository).save(historyCaptor.capture());
        TodoStatusHistory history = historyCaptor.getValue();
        assertThat(history.getTodo()).isSameAs(todo);
        assertThat(history.getFromStatus()).isEqualTo(TodoStatus.TODO);
        assertThat(history.getToStatus()).isEqualTo(TodoStatus.IN_PROGRESS);
    }

    @Test
    void updateTodoStatusShouldNotCreateHistoryWhenStatusIsUnchanged() {
        UUID id = UUID.randomUUID();
        Todo todo = todo(id, "Same status", TodoStatus.DONE, TodoPriority.MEDIUM);
        TodoStatusUpdateRequest request = TodoStatusUpdateRequest.builder()
                .status(TodoStatus.DONE)
                .build();

        when(todoRepository.findByIdAndDeletedAtIsNull(id)).thenReturn(Optional.of(todo));
        when(todoRepository.save(any(Todo.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(todoMapper.toResponse(todo)).thenReturn(response(todo));

        todoService.updateTodoStatus(id, request);

        verify(todoStatusHistoryRepository, never()).save(any(TodoStatusHistory.class));
    }

    @Test
    void deleteTodoShouldSoftDeleteActiveTodo() {
        UUID id = UUID.randomUUID();
        Todo todo = todo(id, "Delete me", TodoStatus.TODO, TodoPriority.LOW);
        LocalDateTime beforeDelete = LocalDateTime.now();

        when(todoRepository.findByIdAndDeletedAtIsNull(id)).thenReturn(Optional.of(todo));

        todoService.deleteTodo(id);

        verify(todoRepository).save(todoCaptor.capture());
        Todo savedTodo = todoCaptor.getValue();
        assertThat(savedTodo.getDeletedAt()).isNotNull();
        assertThat(savedTodo.getDeletedAt()).isAfterOrEqualTo(beforeDelete);
    }

    private Todo todo(String title, TodoStatus status, TodoPriority priority) {
        return todo(UUID.randomUUID(), title, status, priority);
    }

    private Todo todo(UUID id, String title, TodoStatus status, TodoPriority priority) {
        return Todo.builder()
                .id(id)
                .title(title)
                .description("Description")
                .status(status)
                .priority(priority)
                .dueDate(LocalDateTime.of(2026, 7, 8, 14, 30, 0))
                .build();
    }

    private TodoResponse response(Todo todo) {
        return TodoResponse.builder()
                .id(todo.getId())
                .title(todo.getTitle())
                .description(todo.getDescription())
                .status(todo.getStatus())
                .priority(todo.getPriority())
                .dueDate(todo.getDueDate())
                .build();
    }
}
