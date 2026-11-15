package com.erp.arquivo.domain;

import com.erp.comum.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "arquivo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Arquivo extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "empresa_id")
    private Long empresaId;

    @Column(nullable = false, length = 255)
    private String nome;

    @Column(nullable = false, length = 30)
    private String extensao;

    @Column(nullable = false, length = 100)
    private String tipo;

    @Column(nullable = false)
    private Long tamanho;

    @Lob
    @Column(name = "dados", nullable = false)
    private byte[] dados;
}
