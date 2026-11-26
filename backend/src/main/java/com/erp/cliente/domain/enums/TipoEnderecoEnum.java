package com.erp.cliente.domain.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum TipoEnderecoEnum {

    PRINCIPAL("Principal"),
    ENTREGA("Entrega"),
    COBRANCA("Cobrança"),
    OUTRO("Outro");

    private final String descricao;
}
