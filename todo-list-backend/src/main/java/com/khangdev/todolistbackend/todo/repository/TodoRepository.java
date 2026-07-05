package com.khangdev.todolistbackend.todo.repository;

import com.khangdev.todolistbackend.todo.entity.Todo;
import com.khangdev.todolistbackend.todo.enums.TodoStatus;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface TodoRepository extends JpaRepository<Todo, UUID>, JpaSpecificationExecutor<Todo> {

    Optional<Todo> findByIdAndDeletedAtIsNull(UUID id);

    boolean existsByIdAndDeletedAtIsNull(UUID id);

    long countByDeletedAtIsNull();

    long countByStatusAndDeletedAtIsNull(TodoStatus status);
}
