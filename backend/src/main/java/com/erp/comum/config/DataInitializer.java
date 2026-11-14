package com.erp.comum.config;

import com.erp.cliente.domain.Cliente;
import com.erp.cliente.repository.ClienteRepository;
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
    private final ClienteRepository clienteRepository;
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

        // 2. Empresas (Matriz e Filial São Paulo)
        Empresa matriz = empresaRepository.findByCnpj("12345678000195")
                .orElseGet(() -> empresaRepository.save(Empresa.builder()
                        .razaoSocial("EMPRESA MATRIZ EXEMPLO LTDA")
                        .nomeFantasia("Matriz ERP")
                        .cnpj("12345678000195")
                        .inscricaoEstadual("110220330110")
                        .cidade("São Paulo")
                        .uf("SP")
                        .situacao("ATIVO")
                        .build()));

        Empresa filialSp = empresaRepository.findByCnpj("98765432000188")
                .orElseGet(() -> empresaRepository.save(Empresa.builder()
                        .razaoSocial("FILIAL SAO PAULO COMERCIO DE ALIMENTOS LTDA")
                        .nomeFantasia("Filial SP")
                        .cnpj("98765432000188")
                        .inscricaoEstadual("990880770220")
                        .cidade("Campinas")
                        .uf("SP")
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

        // 4. Vínculo Usuário x Empresas (Acesso à Matriz e à Filial)
        final Usuario usuarioFinal = adminUsuario;
        usuarioEmpresaRepository.findByUsuarioIdAndEmpresaId(adminUsuario.getId(), matriz.getId())
                .orElseGet(() -> usuarioEmpresaRepository.save(UsuarioEmpresa.builder()
                        .usuario(usuarioFinal)
                        .empresa(matriz)
                        .padrao(1)
                        .build()));

        usuarioEmpresaRepository.findByUsuarioIdAndEmpresaId(adminUsuario.getId(), filialSp.getId())
                .orElseGet(() -> usuarioEmpresaRepository.save(UsuarioEmpresa.builder()
                        .usuario(usuarioFinal)
                        .empresa(filialSp)
                        .padrao(0)
                        .build()));

        // 5. Carga de Clientes de Teste para Empresa 1 (Matriz)
        if (!clienteRepository.existsByEmpresaIdAndDocumento(matriz.getId(), "11222333000144")) {
            clienteRepository.save(Cliente.builder()
                    .empresaId(matriz.getId())
                    .tipoPessoa("PJ")
                    .documento("11222333000144")
                    .nomeRazaoSocial("DISTRIBUIDORA MATRIZ ALIMENTOS LTDA")
                    .nomeFantasia("Matriz Alimentos")
                    .email("contato@matrizalimentos.com.br")
                    .telefone("(11) 3456-7890")
                    .situacao("ATIVO")
                    .build());
        }

        if (!clienteRepository.existsByEmpresaIdAndDocumento(matriz.getId(), "12345678900")) {
            clienteRepository.save(Cliente.builder()
                    .empresaId(matriz.getId())
                    .tipoPessoa("PF")
                    .documento("12345678900")
                    .nomeRazaoSocial("Carlos Alberto de Souza (Matriz)")
                    .email("carlos.souza@gmail.com")
                    .telefone("(11) 98765-4321")
                    .situacao("ATIVO")
                    .build());
        }

        // 6. Carga de Clientes de Teste para Empresa 2 (Filial SP)
        if (!clienteRepository.existsByEmpresaIdAndDocumento(filialSp.getId(), "44555666000177")) {
            clienteRepository.save(Cliente.builder()
                    .empresaId(filialSp.getId())
                    .tipoPessoa("PJ")
                    .documento("44555666000177")
                    .nomeRazaoSocial("AUTO PECAS PAULISTA LTDA")
                    .nomeFantasia("Paulista Auto Peças")
                    .email("vendas@autopecaspaulista.com.br")
                    .telefone("(19) 3876-1122")
                    .situacao("ATIVO")
                    .build());
        }

        if (!clienteRepository.existsByEmpresaIdAndDocumento(filialSp.getId(), "77888999000100")) {
            clienteRepository.save(Cliente.builder()
                    .empresaId(filialSp.getId())
                    .tipoPessoa("PJ")
                    .documento("77888999000100")
                    .nomeRazaoSocial("RESTAURANTE SABOR DE SAO PAULO LTDA")
                    .nomeFantasia("Sabor Paulista")
                    .email("financeiro@saborpaulista.com.br")
                    .telefone("(19) 3221-5500")
                    .situacao("ATIVO")
                    .build());
        }

        if (!clienteRepository.existsByEmpresaIdAndDocumento(filialSp.getId(), "98765432100")) {
            clienteRepository.save(Cliente.builder()
                    .empresaId(filialSp.getId())
                    .tipoPessoa("PF")
                    .documento("98765432100")
                    .nomeRazaoSocial("Mariana Silva Santos (Filial SP)")
                    .email("mariana.santos@outlook.com")
                    .telefone("(19) 97123-4567")
                    .situacao("ATIVO")
                    .build());
        }

        log.info("Carga de dados de segurança e empresas concluída com sucesso.");
    }
}
