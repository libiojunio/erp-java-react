package com.erp.cliente.repository;

import com.erp.cliente.domain.Cliente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    List<Cliente> findByEmpresaId(Long empresaId);

    Page<Cliente> findByEmpresaId(Long empresaId, Pageable pageable);

    Optional<Cliente> findByIdAndEmpresaId(Long id, Long empresaId);

    boolean existsByEmpresaIdAndDocumento(Long empresaId, String documento);
}
