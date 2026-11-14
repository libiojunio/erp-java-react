package com.erp.seguranca.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrocaEmpresaRequest {

    @NotNull(message = "O identificador da empresa é obrigatório")
    @Schema(example = "1")
    private Long empresaId;
}
