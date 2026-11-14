package com.erp.seguranca.dto;

import com.erp.empresa.domain.Empresa;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmpresaResumoDto {

    private Long id;
    private String razaoSocial;
    private String nomeFantasia;
    private String cnpj;

    public static EmpresaResumoDto fromEntity(Empresa empresa) {
        if (empresa == null) return null;
        return EmpresaResumoDto.builder()
                .id(empresa.getId())
                .razaoSocial(empresa.getRazaoSocial())
                .nomeFantasia(empresa.getNomeFantasia())
                .cnpj(empresa.getCnpj())
                .build();
    }
}
