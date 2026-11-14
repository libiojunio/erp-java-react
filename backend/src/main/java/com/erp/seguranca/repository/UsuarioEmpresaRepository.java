package com.erp.seguranca.repository;

import com.erp.seguranca.domain.UsuarioEmpresa;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioEmpresaRepository extends JpaRepository<UsuarioEmpresa, Long> {

    @EntityGraph(attributePaths = {"empresa"})
    List<UsuarioEmpresa> findByUsuarioId(Long usuarioId);

    @EntityGraph(attributePaths = {"empresa"})
    Optional<UsuarioEmpresa> findByUsuarioIdAndEmpresaId(Long usuarioId, Long empresaId);

    @EntityGraph(attributePaths = {"empresa"})
    Optional<UsuarioEmpresa> findByUsuarioIdAndPadrao(Long usuarioId, Integer padrao);
}
