package com.erp.empresa.repository;

import com.erp.empresa.domain.Empresa;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmpresaRepository extends JpaRepository<Empresa, Long> {

    Optional<Empresa> findByCnpj(String cnpj);

    List<Empresa> findBySituacao(String situacao);

    boolean existsByCnpj(String cnpj);

    boolean existsByCnpjAndIdNot(String cnpj, Long id);

    @Modifying
    @Query("UPDATE Empresa e SET e.arquivoId = NULL WHERE e.arquivoId = :arquivoId")
    void desvincularArquivo(@Param("arquivoId") Long arquivoId);

    @Query("SELECT e FROM Empresa e WHERE " +
           "(:filtro IS NULL OR LOWER(e.razaoSocial) LIKE LOWER(CONCAT('%', :filtro, '%')) " +
           " OR LOWER(e.nomeFantasia) LIKE LOWER(CONCAT('%', :filtro, '%')) " +
           " OR e.cnpj LIKE CONCAT('%', :filtro, '%')) " +
           "AND (:situacao IS NULL OR e.situacao = :situacao) " +
           "ORDER BY e.id DESC")
    Page<Empresa> buscarComFiltros(
            @Param("filtro") String filtro,
            @Param("situacao") String situacao,
            Pageable pageable
    );
}
