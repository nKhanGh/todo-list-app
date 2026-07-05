package com.khangdev.todolistbackend.todo.mapper;

import com.khangdev.todolistbackend.todo.dto.response.TodoDetailResponse;
import com.khangdev.todolistbackend.todo.dto.response.TodoResponse;
import com.khangdev.todolistbackend.todo.dto.response.TodoStatusHistoryResponse;
import com.khangdev.todolistbackend.todo.entity.Todo;
import com.khangdev.todolistbackend.todo.entity.TodoStatusHistory;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface TodoMapper {

    TodoResponse toResponse(Todo todo);

    @Mapping(target = "statusHistories", ignore = true)
    TodoDetailResponse toDetailResponse(Todo todo);

    TodoStatusHistoryResponse toResponse(TodoStatusHistory history);

    List<TodoStatusHistoryResponse> toHistoryResponses(List<TodoStatusHistory> histories);
}
