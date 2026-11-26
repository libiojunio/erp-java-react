package com.erp.cliente.dto;

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
@Schema(description = "Formulário com filtros de pesquisa e paginação para listagem de clientes")
public class ClienteFiltroForm extends PaginacaoFiltroForm {

    @Schema(description = "Termo de busca por Razão Social, Nome Fantasia ou CPF/CNPJ")
    private String termo;

    @Schema(description = "Situação cadastral do cliente (TODOS, ATIVO, INATIVO)", example = "ATIVO")
    private String situacao;

    public Pageable toPageable(Pageable fallback) {
        if (getPage() != null || getSize() != null || getSortProperty() != null || getSortDirection() != null) {
            int defaultPage = 0;
            if (fallback != null) {
                defaultPage = fallback.getPageNumber();
            }

            int defaultSize = 10;
            if (fallback != null) {
                defaultSize = fallback.getPageSize();
            }

            return toPageable(defaultPage, defaultSize, "id", "DESC");
        }

        if (fallback != null) {
            return fallback;
        }

        return toPageable(0, 10, "id", "DESC");
    }
}
