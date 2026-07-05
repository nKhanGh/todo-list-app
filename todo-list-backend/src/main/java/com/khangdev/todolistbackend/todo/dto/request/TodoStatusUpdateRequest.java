package com.khangdev.todolistbackend.todo.dto.request;

import com.khangdev.todolistbackend.todo.enums.TodoStatus;
import jakarta.validation.constraints.NotNull;
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
public class TodoStatusUpdateRequest {

    @NotNull(message = "Status is required")
    private TodoStatus status;
}
