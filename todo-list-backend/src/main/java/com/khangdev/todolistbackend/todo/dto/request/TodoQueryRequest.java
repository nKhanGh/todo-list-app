package com.khangdev.todolistbackend.todo.dto.request;

import com.khangdev.todolistbackend.todo.enums.TodoPriority;
import com.khangdev.todolistbackend.todo.enums.TodoStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
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
public class TodoQueryRequest {

    @Size(max = 255, message = "Search must not exceed 255 characters")
    private String search;

    private TodoStatus status;

    private TodoPriority priority;

    @Min(value = 0, message = "Page must be greater than or equal to 0")
    @Builder.Default
    private int page = 0;

    @Min(value = 1, message = "Size must be greater than or equal to 1")
    @Max(value = 50, message = "Size must not exceed 50")
    @Builder.Default
    private int size = 10;

    @Pattern(
            regexp = "createdAt|updatedAt|dueDate|priority|status|title",
            message = "Sort field must be one of: createdAt, updatedAt, dueDate, priority, status, title"
    )
    @Builder.Default
    private String sortBy = "createdAt";

    @Pattern(
            regexp = "asc|desc",
            flags = Pattern.Flag.CASE_INSENSITIVE,
            message = "Sort direction must be asc or desc"
    )
    @Builder.Default
    private String sortDirection = "desc";
}
