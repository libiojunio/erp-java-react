package com.erp.cliente.domain.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum TipoPessoaEnum {

    PF("Pessoa Física"),
    PJ("Pessoa Jurídica");

    private final String descricao;
}
