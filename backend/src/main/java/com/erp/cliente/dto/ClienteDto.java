package com.erp.cliente.dto;

import com.erp.cliente.domain.Cliente;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClienteDto {

    private Long id;
    private Long empresaId;
    private String tipoPessoa;
    private String documento;
    private String nomeRazaoSocial;
    private String nomeFantasia;
    private String inscricaoEstadual;
    private LocalDate dataNascimento;
    private String email;
    private String telefone;
    private String situacao;

    public static ClienteDto fromEntity(Cliente cliente) {
        if (cliente == null) return null;
        return ClienteDto.builder()
                .id(cliente.getId())
                .empresaId(cliente.getEmpresaId())
                .tipoPessoa(cliente.getTipoPessoa())
                .documento(cliente.getDocumento())
                .nomeRazaoSocial(cliente.getNomeRazaoSocial())
                .nomeFantasia(cliente.getNomeFantasia())
                .inscricaoEstadual(cliente.getInscricaoEstadual())
                .dataNascimento(cliente.getDataNascimento())
                .email(cliente.getEmail())
                .telefone(cliente.getTelefone())
                .situacao(cliente.getSituacao())
                .build();
    }
}
