package com.erp.empresa.dto;

import com.erp.comum.dto.PaginacaoFiltroForm;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.domain.Pageable;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Schema(description = "Formulário com filtros de pesquisa e paginação para listagem de empresas")
public class EmpresaFiltroForm extends PaginacaoFiltroForm {

    @Schema(description = "Termo de busca por Razão Social, Nome Fantasia ou CNPJ")
    private String filtro;

    @Schema(description = "Situação da empresa (TODOS, ATIVO, INATIVO)", example = "ATIVO")
    private String situacao;

    public Pageable toPageable() {
        return toPageable(0, 10, "id", "DESC");
    }
}
