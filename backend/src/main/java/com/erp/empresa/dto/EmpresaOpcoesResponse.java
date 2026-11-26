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
@Schema(description = "Conjunto de opções para campos select utilizados no módulo de empresas")
public class EmpresaOpcoesResponse {

    @Schema(description = "Lista de opções para a situação da empresa")
    private List<OpcaoSelectDto> situacoes;
}
