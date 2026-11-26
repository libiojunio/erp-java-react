package com.erp.cliente.domain.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum SituacaoClienteEnum {

    ATIVO("Ativo"),
    INATIVO("Inativo");

    private final String descricao;
}
