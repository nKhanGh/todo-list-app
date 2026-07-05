package com.khangdev.todolistbackend.todo.repository;

import com.khangdev.todolistbackend.todo.entity.TodoStatusHistory;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TodoStatusHistoryRepository extends JpaRepository<TodoStatusHistory, UUID> {

    List<TodoStatusHistory> findByTodoIdOrderByChangedAtAsc(UUID todoId);
}
