package com.codetogether.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "rooms")
public class Room extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    // Default constructor
    public Room() {
    }

    public Room(String name, User createdBy) {
        this.name = name;
        this.createdBy = createdBy;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }
}
