package com.erp.cliente.domain;

import com.erp.comum.audit.AuditableEntity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cliente_contato")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClienteContato extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    @JsonBackReference
    private Cliente cliente;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(length = 100)
    private String cargo;

    @Column(length = 150)
    private String email;

    @Column(length = 20)
    private String telefone;
}
