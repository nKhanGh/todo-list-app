package com.khangdev.todolistbackend.todo.service;

import com.khangdev.todolistbackend.common.exception.AppException;
import com.khangdev.todolistbackend.common.exception.ErrorCode;
import com.khangdev.todolistbackend.common.response.PageResponse;
import com.khangdev.todolistbackend.todo.dto.request.TodoCreateRequest;
import com.khangdev.todolistbackend.todo.dto.request.TodoQueryRequest;
import com.khangdev.todolistbackend.todo.dto.request.TodoStatusUpdateRequest;
import com.khangdev.todolistbackend.todo.dto.request.TodoUpdateRequest;
import com.khangdev.todolistbackend.todo.dto.response.TodoDetailResponse;
import com.khangdev.todolistbackend.todo.dto.response.TodoResponse;
import com.khangdev.todolistbackend.todo.dto.response.TodoStatisticsResponse;
import com.khangdev.todolistbackend.todo.dto.response.TodoStatusHistoryResponse;
import com.khangdev.todolistbackend.todo.entity.Todo;
import com.khangdev.todolistbackend.todo.entity.TodoStatusHistory;
import com.khangdev.todolistbackend.todo.enums.TodoPriority;
import com.khangdev.todolistbackend.todo.enums.TodoStatus;
import com.khangdev.todolistbackend.todo.mapper.TodoMapper;
import com.khangdev.todolistbackend.todo.repository.TodoRepository;
import com.khangdev.todolistbackend.todo.repository.TodoStatusHistoryRepository;
import jakarta.persistence.criteria.Predicate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TodoServiceImpl implements TodoService {

    private final TodoRepository todoRepository;

    private final TodoStatusHistoryRepository todoStatusHistoryRepository;

    private final TodoMapper todoMapper;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<TodoResponse> getTodos(TodoQueryRequest request) {
        Sort sort = Sort.by(getSortDirection(request.getSortDirection()), request.getSortBy());
        PageRequest pageRequest = PageRequest.of(request.getPage(), request.getSize(), sort);

        Page<TodoResponse> todos = todoRepository.findAll(buildSpecification(request), pageRequest)
                .map(todoMapper::toResponse);

        return PageResponse.from(todos);
    }

    @Override
    @Transactional(readOnly = true)
    public TodoStatisticsResponse getStatistics() {
        long total = todoRepository.countByDeletedAtIsNull();
        long todo = todoRepository.countByStatusAndDeletedAtIsNull(TodoStatus.TODO);
        long inProgress = todoRepository.countByStatusAndDeletedAtIsNull(TodoStatus.IN_PROGRESS);
        long done = todoRepository.countByStatusAndDeletedAtIsNull(TodoStatus.DONE);
        int progress = total == 0 ? 0 : Math.round((done * 100f) / total);

        return TodoStatisticsResponse.builder()
                .total(total)
                .todo(todo)
                .inProgress(inProgress)
                .done(done)
                .progress(progress)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public TodoDetailResponse getTodo(UUID id) {
        Todo todo = findActiveTodo(id);
        List<TodoStatusHistoryResponse> statusHistories = todoMapper.toHistoryResponses(
                todoStatusHistoryRepository.findByTodoIdOrderByChangedAtAsc(id)
        );

        TodoDetailResponse response = todoMapper.toDetailResponse(todo);
        response.setStatusHistories(statusHistories);

        return response;
    }

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

    @Override
    @Transactional
    public TodoResponse updateTodo(UUID id, TodoUpdateRequest request) {
        Todo todo = findActiveTodo(id);

        todo.setTitle(normalizeTitle(request.getTitle()));
        todo.setDescription(request.getDescription());
        todo.setPriority(request.getPriority());
        todo.setDueDate(request.getDueDate());

        Todo savedTodo = todoRepository.save(todo);

        return todoMapper.toResponse(savedTodo);
    }

    @Override
    @Transactional
    public TodoResponse updateTodoStatus(UUID id, TodoStatusUpdateRequest request) {
        Todo todo = findActiveTodo(id);
        TodoStatus oldStatus = todo.getStatus();

        todo.setStatus(request.getStatus());
        Todo savedTodo = todoRepository.save(todo);
        createStatusHistoryIfChanged(savedTodo, oldStatus, request.getStatus());

        return todoMapper.toResponse(savedTodo);
    }

    @Override
    @Transactional
    public void deleteTodo(UUID id) {
        Todo todo = findActiveTodo(id);
        todo.setDeletedAt(LocalDateTime.now());
        todoRepository.save(todo);
    }

    private String normalizeTitle(String title) {
        if (title == null || title.isBlank()) {
            throw new AppException(ErrorCode.VALIDATION_FAILED, "Title is required");
        }

        return title.trim();
    }

    private Todo findActiveTodo(UUID id) {
        return todoRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND, "Todo not found"));
    }

    private void createInitialStatusHistory(Todo todo) {
        TodoStatusHistory history = TodoStatusHistory.builder()
                .todo(todo)
                .toStatus(todo.getStatus())
                .build();

        todoStatusHistoryRepository.save(history);
    }

    private void createStatusHistoryIfChanged(Todo todo, TodoStatus fromStatus, TodoStatus toStatus) {
        if (fromStatus == toStatus) {
            return;
        }

        TodoStatusHistory history = TodoStatusHistory.builder()
                .todo(todo)
                .fromStatus(fromStatus)
                .toStatus(toStatus)
                .build();

        todoStatusHistoryRepository.save(history);
    }

    private Sort.Direction getSortDirection(String sortDirection) {
        return sortDirection.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
    }

    private Specification<Todo> buildSpecification(TodoQueryRequest request) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(criteriaBuilder.isNull(root.get("deletedAt")));

            if (request.getStatus() != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), request.getStatus()));
            }

            if (request.getPriority() != null) {
                predicates.add(criteriaBuilder.equal(root.get("priority"), request.getPriority()));
            }

            if (request.getSearch() != null && !request.getSearch().isBlank()) {
                String keyword = "%" + request.getSearch().trim().toLowerCase(Locale.ROOT) + "%";
                predicates.add(criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), keyword),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), keyword)
                ));
            }

            return criteriaBuilder.and(predicates.toArray(Predicate[]::new));
        };
    }
}
