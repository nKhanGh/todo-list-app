package com.khangdev.todolistbackend.todo.dto.request;

import com.khangdev.todolistbackend.todo.enums.TodoPriority;
import com.khangdev.todolistbackend.todo.enums.TodoStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
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
public class TodoUpdateRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    @NotNull(message = "Priority is required")
    private TodoPriority priority;

    @NotNull(message = "Status is required")
    private TodoStatus status;

    private LocalDate dueDate;
}
