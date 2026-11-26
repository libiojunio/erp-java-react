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
@Schema(description = "Conjunto de opções para campos select utilizados no módulo de clientes")
public class ClienteOpcoesResponse {

    @Schema(description = "Lista de opções para a situação do cliente")
    private List<OpcaoSelectDto> situacoes;

    @Schema(description = "Lista de opções para o tipo de pessoa")
    private List<OpcaoSelectDto> tiposPessoa;

    @Schema(description = "Lista de opções para os tipos de endereço")
    private List<OpcaoSelectDto> tiposEndereco;

    @Schema(description = "Lista de opções para os tipos de contato")
    private List<OpcaoSelectDto> tiposContato;
}
