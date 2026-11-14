package com.erp.comum.config;

import com.erp.empresa.domain.Empresa;
import com.erp.empresa.repository.EmpresaRepository;
import com.erp.seguranca.domain.Perfil;
import com.erp.seguranca.domain.Usuario;
import com.erp.seguranca.domain.UsuarioEmpresa;
import com.erp.seguranca.repository.PerfilRepository;
import com.erp.seguranca.repository.UsuarioEmpresaRepository;
import com.erp.seguranca.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final PerfilRepository perfilRepository;
    private final EmpresaRepository empresaRepository;
    private final UsuarioRepository usuarioRepository;
    private final UsuarioEmpresaRepository usuarioEmpresaRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Verificando carga de dados iniciais do sistema...");

        // 1. Perfis
        Perfil adminPerfil = perfilRepository.findByNome("ROLE_ADMIN")
                .orElseGet(() -> perfilRepository.save(Perfil.builder()
                        .nome("ROLE_ADMIN")
                        .descricao("Administrador do Sistema")
                        .build()));

        perfilRepository.findByNome("ROLE_OPERADOR")
                .orElseGet(() -> perfilRepository.save(Perfil.builder()
                        .nome("ROLE_OPERADOR")
                        .descricao("Operador do Sistema")
                        .build()));

        // 2. Empresa Matriz
        Empresa matriz = empresaRepository.findByCnpj("12345678000195")
                .orElseGet(() -> empresaRepository.save(Empresa.builder()
                        .razaoSocial("EMPRESA MATRIZ EXEMPLO LTDA")
                        .nomeFantasia("Matriz ERP")
                        .cnpj("12345678000195")
                        .situacao("ATIVO")
                        .build()));

        // 3. Usuário Administrador Inicial (admin@erp.com / admin123)
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail("admin@erp.com");
        Usuario adminUsuario;

        if (usuarioOpt.isEmpty()) {
            adminUsuario = Usuario.builder()
                    .nome("Administrador Master")
                    .email("admin@erp.com")
                    .senha(passwordEncoder.encode("admin123"))
                    .situacao("ATIVO")
                    .perfis(Set.of(adminPerfil))
                    .build();
            adminUsuario = usuarioRepository.save(adminUsuario);
            log.info("Usuário inicial criado: admin@erp.com (senha: admin123)");
        } else {
            adminUsuario = usuarioOpt.get();
            // Garante que a senha bate com admin123 para o hash do encoder ativo
            if (!passwordEncoder.matches("admin123", adminUsuario.getSenha())) {
                adminUsuario.setSenha(passwordEncoder.encode("admin123"));
                adminUsuario = usuarioRepository.save(adminUsuario);
                log.info("Senha do usuário admin@erp.com sincronizada para admin123");
            }
        }

        // 4. Vinculo Usuario x Empresa
        final Usuario usuarioFinal = adminUsuario;
        usuarioEmpresaRepository.findByUsuarioIdAndEmpresaId(adminUsuario.getId(), matriz.getId())
                .orElseGet(() -> usuarioEmpresaRepository.save(UsuarioEmpresa.builder()
                        .usuario(usuarioFinal)
                        .empresa(matriz)
                        .padrao(1)
                        .build()));

        log.info("Carga de dados de segurança verificada com sucesso.");
    }
}
