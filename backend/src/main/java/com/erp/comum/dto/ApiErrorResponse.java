package com.erp.comum.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiErrorResponse {

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    private int status;
    private String erro;
    private String mensagem;
    private String path;
    private List<CampoErro> errosValidacao;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CampoErro {
        private String campo;
        private String mensagem;
    }
}
