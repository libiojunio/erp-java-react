package com.erp.seguranca.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private String token;

    @Builder.Default
    private String tipo = "Bearer";

    private UsuarioResumoDto usuario;
    private EmpresaResumoDto empresaAtiva;
    private List<EmpresaResumoDto> empresas;
}
