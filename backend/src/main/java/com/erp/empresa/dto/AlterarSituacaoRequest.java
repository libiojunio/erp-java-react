package com.erp.empresa.dto;

import io.swagger.v3.oas.annotations.media.Schema;
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
public class AlterarSituacaoRequest {

    @NotBlank(message = "A situação é obrigatória")
    @Pattern(regexp = "^(ATIVO|INATIVO)$", message = "A situação deve ser ATIVO ou INATIVO")
    @Schema(example = "INATIVO", allowableValues = {"ATIVO", "INATIVO"})
    private String situacao;
}
