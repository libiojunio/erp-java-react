package com.erp.cliente.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClienteRequest {

    @NotBlank(message = "O tipo de pessoa (PF ou PJ) é obrigatório")
    @Pattern(regexp = "^(PF|PJ)$", message = "Tipo de pessoa deve ser PF ou PJ")
    private String tipoPessoa;

    @NotBlank(message = "O documento (CPF ou CNPJ) é obrigatório")
    private String documento;

    @NotBlank(message = "O nome ou razão social é obrigatório")
    private String nomeRazaoSocial;

    private String nomeFantasia;

    private String inscricaoEstadual;

    private LocalDate dataNascimento;

    private String email;

    private String telefone;

    private Long arquivoId;

    @Valid
    @Builder.Default
    private List<ClienteEnderecoDto> enderecos = new ArrayList<>();

    @Valid
    @Builder.Default
    private List<ClienteContatoDto> contatos = new ArrayList<>();
}
