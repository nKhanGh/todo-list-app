package com.khangdev.todolistbackend.todo.dto.response;

import com.khangdev.todolistbackend.todo.enums.TodoPriority;
import com.khangdev.todolistbackend.todo.enums.TodoStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TodoDetailResponse {

    private UUID id;

    private String title;

    private String description;

    private TodoStatus status;

    private TodoPriority priority;

    private LocalDate dueDate;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private List<TodoStatusHistoryResponse> statusHistories;
}
