package com.erp.seguranca.service;

import com.erp.comum.exception.BusinessException;
import com.erp.comum.multitenancy.TenantContext;
import com.erp.empresa.domain.Empresa;
import com.erp.empresa.repository.EmpresaRepository;
import com.erp.seguranca.domain.Perfil;
import com.erp.seguranca.domain.Usuario;
import com.erp.seguranca.domain.UsuarioEmpresa;
import com.erp.seguranca.dto.*;
import com.erp.seguranca.jwt.JwtService;
import com.erp.seguranca.repository.UsuarioEmpresaRepository;
import com.erp.seguranca.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioEmpresaRepository usuarioEmpresaRepository;
    private final EmpresaRepository empresaRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Credenciais de acesso inválidas"));

        if (!"ATIVO".equalsIgnoreCase(usuario.getSituacao())) {
            throw new BusinessException("Usuário inativo ou bloqueado no sistema");
        }

        if (!passwordEncoder.matches(request.getSenha(), usuario.getSenha())) {
            throw new BadCredentialsException("Credenciais de acesso inválidas");
        }

        List<UsuarioEmpresa> vinculos = usuarioEmpresaRepository.findByUsuarioId(usuario.getId());
        if (vinculos.isEmpty()) {
            throw new BusinessException("O usuário não possui vínculo com nenhuma empresa cadastrada");
        }

        // Seleciona a empresa padrão ou a primeira disponível
        UsuarioEmpresa vinculoAtivo = vinculos.stream()
                .filter(v -> v.getPadrao() != null && v.getPadrao() == 1)
                .findFirst()
                .orElse(vinculos.get(0));

        Empresa empresaAtiva = vinculoAtivo.getEmpresa();

        List<String> perfisNomes = usuario.getPerfis().stream()
                .map(Perfil::getNome)
                .collect(Collectors.toList());

        String token = jwtService.gerarToken(
                usuario.getId(),
                usuario.getEmail(),
                usuario.getNome(),
                empresaAtiva.getId(),
                perfisNomes
        );

        List<EmpresaResumoDto> empresasDto = vinculos.stream()
                .map(v -> EmpresaResumoDto.fromEntity(v.getEmpresa()))
                .collect(Collectors.toList());

        return LoginResponse.builder()
                .token(token)
                .tipo("Bearer")
                .usuario(UsuarioResumoDto.fromEntity(usuario))
                .empresaAtiva(EmpresaResumoDto.fromEntity(empresaAtiva))
                .empresas(empresasDto)
                .build();
    }

    @Transactional(readOnly = true)
    public LoginResponse trocarEmpresaAtiva(Long novoEmpresaId) {
        Usuario usuario = getUsuarioLogado();

        UsuarioEmpresa vinculo = usuarioEmpresaRepository.findByUsuarioIdAndEmpresaId(usuario.getId(), novoEmpresaId)
                .orElseThrow(() -> new BusinessException("Você não possui permissão para acessar esta empresa"));

        Empresa novaEmpresaAtiva = vinculo.getEmpresa();
        if (!"ATIVO".equalsIgnoreCase(novaEmpresaAtiva.getSituacao())) {
            throw new BusinessException("A empresa selecionada encontra-se inativa no sistema");
        }

        List<String> perfisNomes = usuario.getPerfis().stream()
                .map(Perfil::getNome)
                .collect(Collectors.toList());

        String novoToken = jwtService.gerarToken(
                usuario.getId(),
                usuario.getEmail(),
                usuario.getNome(),
                novaEmpresaAtiva.getId(),
                perfisNomes
        );

        List<EmpresaResumoDto> empresasDto = usuarioEmpresaRepository.findByUsuarioId(usuario.getId()).stream()
                .map(v -> EmpresaResumoDto.fromEntity(v.getEmpresa()))
                .collect(Collectors.toList());

        return LoginResponse.builder()
                .token(novoToken)
                .tipo("Bearer")
                .usuario(UsuarioResumoDto.fromEntity(usuario))
                .empresaAtiva(EmpresaResumoDto.fromEntity(novaEmpresaAtiva))
                .empresas(empresasDto)
                .build();
    }

    @Transactional(readOnly = true)
    public LoginResponse obterUsuarioAutenticado() {
        Usuario usuario = getUsuarioLogado();
        Long empresaIdAtiva = TenantContext.getTenantId();

        List<UsuarioEmpresa> vinculos = usuarioEmpresaRepository.findByUsuarioId(usuario.getId());
        
        Empresa empresaAtiva = null;
        if (empresaIdAtiva != null) {
            empresaAtiva = vinculos.stream()
                    .map(UsuarioEmpresa::getEmpresa)
                    .filter(e -> e.getId().equals(empresaIdAtiva))
                    .findFirst()
                    .orElse(null);
        }

        if (empresaAtiva == null && !vinculos.isEmpty()) {
            empresaAtiva = vinculos.get(0).getEmpresa();
        }

        List<EmpresaResumoDto> empresasDto = vinculos.stream()
                .map(v -> EmpresaResumoDto.fromEntity(v.getEmpresa()))
                .collect(Collectors.toList());

        return LoginResponse.builder()
                .usuario(UsuarioResumoDto.fromEntity(usuario))
                .empresaAtiva(EmpresaResumoDto.fromEntity(empresaAtiva))
                .empresas(empresasDto)
                .build();
    }

    private Usuario getUsuarioLogado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BadCredentialsException("Usuário não autenticado");
        }

        String email = authentication.getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Usuário da sessão não encontrado"));
    }
}
