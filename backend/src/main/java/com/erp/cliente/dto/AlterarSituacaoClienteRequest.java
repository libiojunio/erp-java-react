package com.erp.cliente.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlterarSituacaoClienteRequest {

    @NotBlank(message = "A situação é obrigatória (ATIVO ou INATIVO)")
    @Pattern(regexp = "^(ATIVO|INATIVO)$", message = "Situação deve ser ATIVO ou INATIVO")
    private String situacao;
}
