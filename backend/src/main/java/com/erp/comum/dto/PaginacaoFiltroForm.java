package com.erp.comum.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Formulário base para filtros de paginação e ordenação")
public class PaginacaoFiltroForm {

    @Schema(description = "Número da página atual (iniciando em 0)", example = "0", defaultValue = "0")
    private Integer page;

    @Schema(description = "Quantidade de registros por página", example = "10", defaultValue = "10")
    private Integer size;

    @Schema(description = "Nome do campo para ordenação", example = "id", defaultValue = "id")
    private String sortProperty;

    @Schema(description = "Direção da ordenação (ASC ou DESC)", example = "DESC", defaultValue = "DESC")
    private String sortDirection;

    public Pageable toPageable(int defaultPage, int defaultSize, String defaultSortProperty, String defaultSortDirection) {
        int p = defaultPage;
        if (page != null && page >= 0) {
            p = page;
        }

        int s = defaultSize;
        if (size != null && size > 0) {
            s = size;
        }

        String prop = defaultSortProperty;
        if (sortProperty != null && !sortProperty.trim().isEmpty()) {
            prop = sortProperty.trim();
        }

        String dir = defaultSortDirection;
        if (sortDirection != null && !sortDirection.trim().isEmpty()) {
            dir = sortDirection.trim();
        }

        Sort.Direction direction = Sort.Direction.DESC;
        if ("ASC".equalsIgnoreCase(dir)) {
            direction = Sort.Direction.ASC;
        }

        return PageRequest.of(p, s, Sort.by(direction, prop));
    }
}
