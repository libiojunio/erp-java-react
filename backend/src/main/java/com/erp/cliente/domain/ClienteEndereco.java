package com.erp.cliente.domain;

import com.erp.comum.audit.AuditableEntity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cliente_endereco")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClienteEndereco extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    @JsonBackReference
    private Cliente cliente;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String tipo = "PRINCIPAL"; // 'PRINCIPAL', 'COBRANCA', 'ENTREGA'

    @Column(nullable = false, length = 8)
    private String cep;

    @Column(nullable = false, length = 255)
    private String logradouro;

    @Column(nullable = false, length = 50)
    private String numero;

    @Column(length = 100)
    private String complemento;

    @Column(nullable = false, length = 100)
    private String bairro;

    @Column(nullable = false, length = 100)
    private String cidade;

    @Column(nullable = false, length = 2)
    private String uf;
}
