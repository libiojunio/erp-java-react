package com.erp.empresa.repository;

import com.erp.empresa.domain.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmpresaRepository extends JpaRepository<Empresa, Long> {

    Optional<Empresa> findByCnpj(String cnpj);

    List<Empresa> findBySituacao(String situacao);

    boolean existsByCnpj(String cnpj);
}
