package com.codetogether.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SimpleMessage {
    private String userId;
    private String name;
    private String text;
}
