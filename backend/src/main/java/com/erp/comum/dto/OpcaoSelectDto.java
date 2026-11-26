package com.erp.comum.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Representação genérica de uma opção para componentes de seleção/dropdown")
public class OpcaoSelectDto {

    @Schema(description = "Valor correspondente à chave ou constante do enum", example = "ATIVO")
    private String valor;

    @Schema(description = "Descrição amigável para exibição visual ao usuário", example = "Ativo")
    private String descricao;
}
