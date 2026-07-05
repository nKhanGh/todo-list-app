package com.khangdev.todolistbackend.todo.dto.response;

import com.khangdev.todolistbackend.todo.enums.TodoStatus;
import java.time.LocalDateTime;
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
public class TodoStatusHistoryResponse {

    private UUID id;

    private TodoStatus fromStatus;

    private TodoStatus toStatus;

    private LocalDateTime changedAt;
}
