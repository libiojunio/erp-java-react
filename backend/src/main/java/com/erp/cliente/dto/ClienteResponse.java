package com.erp.cliente.dto;

import com.erp.arquivo.dto.ArquivoDto;
import com.erp.cliente.domain.Cliente;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClienteResponse {

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
    private Long arquivoId;
    private ArquivoDto arquivo;
    private LocalDateTime criadoEm;
    private String criadoPor;
    private LocalDateTime alteradoEm;
    private String alteradoPor;
    private Long versao;

    @Builder.Default
    private List<ClienteEnderecoDto> enderecos = new ArrayList<>();

    @Builder.Default
    private List<ClienteContatoDto> contatos = new ArrayList<>();

    public static ClienteResponse fromEntity(Cliente cliente) {
        return fromEntity(cliente, null);
    }

    public static ClienteResponse fromEntity(Cliente cliente, ArquivoDto arquivoDto) {
        if (cliente == null) {
            return null;
        }

        List<ClienteEnderecoDto> enderecosDto = new ArrayList<>();
        if (cliente.getEnderecos() != null) {
            enderecosDto = cliente.getEnderecos().stream()
                    .map(ClienteEnderecoDto::fromEntity)
                    .collect(Collectors.toList());
        }

        List<ClienteContatoDto> contatosDto = new ArrayList<>();
        if (cliente.getContatos() != null) {
            contatosDto = cliente.getContatos().stream()
                    .map(ClienteContatoDto::fromEntity)
                    .collect(Collectors.toList());
        }

        return ClienteResponse.builder()
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
                .arquivoId(cliente.getArquivoId())
                .arquivo(arquivoDto)
                .criadoEm(cliente.getCriadoEm())
                .criadoPor(cliente.getCriadoPor())
                .alteradoEm(cliente.getAlteradoEm())
                .alteradoPor(cliente.getAlteradoPor())
                .versao(cliente.getVersao())
                .enderecos(enderecosDto)
                .contatos(contatosDto)
                .build();
    }
}
