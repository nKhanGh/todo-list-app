package com.khangdev.todolistbackend.todo.dto.response;

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
public class TodoStatisticsResponse {

    private long total;

    private long todo;

    private long inProgress;

    private long done;

    private int progress;
}
