package com.erp.empresa.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmpresaRequest {

    @NotBlank(message = "A razão social é obrigatória")
    @Size(max = 255, message = "A razão social deve ter no máximo 255 caracteres")
    @Schema(example = "COMERCIO DE BEBIDAS E ALIMENTOS LTDA")
    private String razaoSocial;

    @Size(max = 255, message = "O nome fantasia deve ter no máximo 255 caracteres")
    @Schema(example = "Bebidas & Cia")
    private String nomeFantasia;

    @NotBlank(message = "O CNPJ é obrigatório")
    @Schema(example = "12.345.678/0001-95 ou apenas números")
    private String cnpj;

    @Size(max = 30, message = "A inscrição estadual deve ter no máximo 30 caracteres")
    @Schema(example = "123.456.789.110")
    private String inscricaoEstadual;

    @Size(max = 8, message = "O CEP deve ter 8 dígitos")
    @Schema(example = "01310100")
    private String cep;

    @Size(max = 255, message = "O logradouro deve ter no máximo 255 caracteres")
    @Schema(example = "Avenida Paulista")
    private String logradouro;

    @Size(max = 50, message = "O número deve ter no máximo 50 caracteres")
    @Schema(example = "1000")
    private String numero;

    @Size(max = 100, message = "O complemento deve ter no máximo 100 caracteres")
    @Schema(example = "Conjunto 101")
    private String complemento;

    @Size(max = 100, message = "O bairro deve ter no máximo 100 caracteres")
    @Schema(example = "Bela Vista")
    private String bairro;

    @Size(max = 100, message = "A cidade deve ter no máximo 100 caracteres")
    @Schema(example = "São Paulo")
    private String cidade;

    @Size(min = 2, max = 2, message = "A UF deve conter exatamente 2 caracteres")
    @Schema(example = "SP")
    private String uf;
}
