package com.khangdev.todolistbackend.todo.entity;

import com.khangdev.todolistbackend.todo.enums.TodoStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
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
@Entity
@Table(name = "todo_status_histories")
public class TodoStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "todo_id", nullable = false)
    private Todo todo;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private TodoStatus fromStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TodoStatus toStatus;

    @Column(nullable = false, updatable = false)
    private LocalDateTime changedAt;

    @PrePersist
    void prePersist() {
        changedAt = LocalDateTime.now();
    }
}
