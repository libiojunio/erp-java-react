package com.erp.empresa.dto;

import com.erp.comum.dto.OpcaoSelectDto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Conjunto de dados iniciais e opções de campos select para telas do módulo de empresas")
public class EmpresaDadosIniciaisResponse {

    @Schema(description = "Lista de opções para a situação da empresa")
    private List<OpcaoSelectDto> situacoes;

    @Schema(description = "Lista de unidades federativas (UFs)")
    private List<OpcaoSelectDto> ufs;
}
