package com.erp.cliente.domain;

import com.erp.comum.audit.AuditableEntity;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "cliente")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cliente extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "empresa_id", nullable = false)
    private Long empresaId;

    @Column(name = "tipo_pessoa", nullable = false, length = 2)
    private String tipoPessoa; // 'PF' ou 'PJ'

    @Column(nullable = false, length = 14)
    private String documento;

    @Column(name = "nome_razao_social", nullable = false, length = 255)
    private String nomeRazaoSocial;

    @Column(name = "nome_fantasia", length = 255)
    private String nomeFantasia;

    @Column(name = "inscricao_estadual", length = 30)
    private String inscricaoEstadual;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;

    @Column(length = 150)
    private String email;

    @Column(length = 20)
    private String telefone;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String situacao = "ATIVO";

    @Column(name = "arquivo_id")
    private Long arquivoId;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @Builder.Default
    private Set<ClienteEndereco> enderecos = new LinkedHashSet<>();

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @Builder.Default
    private Set<ClienteContato> contatos = new LinkedHashSet<>();

    public void adicionarEndereco(ClienteEndereco endereco) {
        if (enderecos == null) {
            enderecos = new LinkedHashSet<>();
        }
        enderecos.add(endereco);
        endereco.setCliente(this);
    }

    public void removerEndereco(ClienteEndereco endereco) {
        if (enderecos != null) {
            enderecos.remove(endereco);
            endereco.setCliente(null);
        }
    }

    public void adicionarContato(ClienteContato contato) {
        if (contatos == null) {
            contatos = new LinkedHashSet<>();
        }
        contatos.add(contato);
        contato.setCliente(this);
    }

    public void removerContato(ClienteContato contato) {
        if (contatos != null) {
            contatos.remove(contato);
            contato.setCliente(null);
        }
    }
}
