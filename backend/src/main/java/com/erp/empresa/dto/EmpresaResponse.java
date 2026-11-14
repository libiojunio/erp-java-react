package com.erp.empresa.dto;

import com.erp.empresa.domain.Empresa;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmpresaResponse {

    private Long id;
    private String razaoSocial;
    private String nomeFantasia;
    private String cnpj;
    private String inscricaoEstadual;
    private String cep;
    private String logradouro;
    private String numero;
    private String complemento;
    private String bairro;
    private String cidade;
    private String uf;
    private String situacao;
    private LocalDateTime criadoEm;
    private String criadoPor;
    private LocalDateTime alteradoEm;
    private String alteradoPor;

    public static EmpresaResponse fromEntity(Empresa empresa) {
        if (empresa == null) return null;
        return EmpresaResponse.builder()
                .id(empresa.getId())
                .razaoSocial(empresa.getRazaoSocial())
                .nomeFantasia(empresa.getNomeFantasia())
                .cnpj(empresa.getCnpj())
                .inscricaoEstadual(empresa.getInscricaoEstadual())
                .cep(empresa.getCep())
                .logradouro(empresa.getLogradouro())
                .numero(empresa.getNumero())
                .complemento(empresa.getComplemento())
                .bairro(empresa.getBairro())
                .cidade(empresa.getCidade())
                .uf(empresa.getUf())
                .situacao(empresa.getSituacao())
                .criadoEm(empresa.getCriadoEm())
                .criadoPor(empresa.getCriadoPor())
                .alteradoEm(empresa.getAlteradoEm())
                .alteradoPor(empresa.getAlteradoPor())
                .build();
    }
}
