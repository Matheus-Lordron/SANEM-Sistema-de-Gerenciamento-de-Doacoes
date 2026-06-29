package com.oficina_dev.backend.dtos.Item;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class ItemRequestDto {

    @NotBlank
    @Size(min = 3, max = 100)
    private String name;

    @NotNull // Trocado de NotBlank para NotNull
    private Character sex;

    @NotNull // Trocado de NotBlank para NotNull
    private Integer quantity;

    @NotNull // Trocado de NotBlank para NotNull
    private UUID categoryId;

    @NotNull // Trocado de NotBlank para NotNull
    private UUID sizeId;
}