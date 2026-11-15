package com.erp.cliente.repository;

import com.erp.cliente.domain.Cliente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    List<Cliente> findByEmpresaId(Long empresaId);

    Page<Cliente> findByEmpresaId(Long empresaId, Pageable pageable);

    Optional<Cliente> findByIdAndEmpresaId(Long id, Long empresaId);

    @EntityGraph(attributePaths = {"enderecos", "contatos"})
    @Query("SELECT c FROM Cliente c WHERE c.id = :id AND c.empresaId = :empresaId")
    Optional<Cliente> findWithDetailsByIdAndEmpresaId(@Param("id") Long id, @Param("empresaId") Long empresaId);

    boolean existsByEmpresaIdAndDocumento(Long empresaId, String documento);

    boolean existsByEmpresaIdAndDocumentoAndIdNot(Long empresaId, String documento, Long id);

    @Query("SELECT c FROM Cliente c WHERE c.empresaId = :empresaId " +
           "AND (:situacao IS NULL OR c.situacao = :situacao) " +
           "AND (:termo IS NULL OR :termo = '' " +
           "     OR LOWER(c.nomeRazaoSocial) LIKE LOWER(CONCAT('%', :termo, '%')) " +
           "     OR (c.nomeFantasia IS NOT NULL AND LOWER(c.nomeFantasia) LIKE LOWER(CONCAT('%', :termo, '%'))) " +
           "     OR c.documento LIKE CONCAT('%', :termoLimpo, '%'))")
    Page<Cliente> pesquisarClientes(
            @Param("empresaId") Long empresaId,
            @Param("termo") String termo,
            @Param("termoLimpo") String termoLimpo,
            @Param("situacao") String situacao,
            Pageable pageable);
}
