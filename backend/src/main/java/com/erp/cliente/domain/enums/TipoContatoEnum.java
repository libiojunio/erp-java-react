package com.erp.cliente.domain.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum TipoContatoEnum {

    COMERCIAL("Comercial"),
    FINANCEIRO("Financeiro"),
    SUPORTE("Suporte"),
    OUTRO("Outro");

    private final String descricao;
}
