package com.erp.seguranca.repository;

import com.erp.seguranca.domain.Usuario;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    @EntityGraph(attributePaths = {"perfis"})
    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);
}
