package com.erp.comum.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    private boolean sucesso;
    private String mensagem;
    private T dados;

    public static <T> ApiResponse<T> sucesso(T dados) {
        return ApiResponse.<T>builder()
                .sucesso(true)
                .dados(dados)
                .build();
    }

    public static <T> ApiResponse<T> sucesso(String mensagem, T dados) {
        return ApiResponse.<T>builder()
                .sucesso(true)
                .mensagem(mensagem)
                .dados(dados)
                .build();
    }
}
