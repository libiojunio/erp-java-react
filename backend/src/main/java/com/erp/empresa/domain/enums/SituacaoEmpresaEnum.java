package com.erp.empresa.domain.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum SituacaoEmpresaEnum {

    ATIVO("Ativo"),
    INATIVO("Inativo");

    private final String descricao;
}
