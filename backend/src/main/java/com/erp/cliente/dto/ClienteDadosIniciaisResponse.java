package com.erp.cliente.dto;

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
@Schema(description = "Conjunto de dados iniciais e opções de campos select para telas do módulo de clientes")
public class ClienteDadosIniciaisResponse {

    @Schema(description = "Lista de opções para a situação do cliente")
    private List<OpcaoSelectDto> situacoes;

    @Schema(description = "Lista de opções para o tipo de pessoa (PF/PJ)")
    private List<OpcaoSelectDto> tiposPessoa;

    @Schema(description = "Lista de opções para os tipos de endereço")
    private List<OpcaoSelectDto> tiposEndereco;

    @Schema(description = "Lista de opções para os tipos de contato")
    private List<OpcaoSelectDto> tiposContato;

    @Schema(description = "Lista de unidades federativas (UFs)")
    private List<OpcaoSelectDto> ufs;
}
