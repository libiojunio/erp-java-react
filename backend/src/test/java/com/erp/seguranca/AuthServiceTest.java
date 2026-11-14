package com.erp.seguranca;

import com.erp.comum.exception.BusinessException;
import com.erp.empresa.domain.Empresa;
import com.erp.empresa.repository.EmpresaRepository;
import com.erp.seguranca.domain.Perfil;
import com.erp.seguranca.domain.Usuario;
import com.erp.seguranca.domain.UsuarioEmpresa;
import com.erp.seguranca.dto.LoginRequest;
import com.erp.seguranca.dto.LoginResponse;
import com.erp.seguranca.jwt.JwtService;
import com.erp.seguranca.repository.UsuarioEmpresaRepository;
import com.erp.seguranca.repository.UsuarioRepository;
import com.erp.seguranca.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private UsuarioEmpresaRepository usuarioEmpresaRepository;

    @Mock
    private EmpresaRepository empresaRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    private Usuario usuario;
    private Empresa empresa;
    private UsuarioEmpresa usuarioEmpresa;

    @BeforeEach
    void setUp() {
        Perfil perfil = Perfil.builder().id(1L).nome("ROLE_ADMIN").build();

        usuario = Usuario.builder()
                .id(1L)
                .nome("Administrador Master")
                .email("admin@erp.com")
                .senha("hash_senha")
                .situacao("ATIVO")
                .perfis(Set.of(perfil))
                .build();

        empresa = Empresa.builder()
                .id(1L)
                .razaoSocial("EMPRESA MATRIZ EXEMPLO LTDA")
                .nomeFantasia("Matriz ERP")
                .cnpj("12345678000195")
                .situacao("ATIVO")
                .build();

        usuarioEmpresa = UsuarioEmpresa.builder()
                .id(1L)
                .usuario(usuario)
                .empresa(empresa)
                .padrao(1)
                .build();
    }

    @Test
    @DisplayName("Deve autenticar com sucesso e retornar token e empresa ativa")
    void deveAutenticarComSucesso() {
        LoginRequest request = LoginRequest.builder()
                .email("admin@erp.com")
                .senha("admin123")
                .build();

        when(usuarioRepository.findByEmail("admin@erp.com")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("admin123", "hash_senha")).thenReturn(true);
        when(usuarioEmpresaRepository.findByUsuarioId(1L)).thenReturn(List.of(usuarioEmpresa));
        when(jwtService.gerarToken(any(), anyString(), anyString(), any(), any())).thenReturn("mocked.jwt.token");

        LoginResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("mocked.jwt.token", response.getToken());
        assertEquals("admin@erp.com", response.getUsuario().getEmail());
        assertEquals(1L, response.getEmpresaAtiva().getId());
        assertEquals("Matriz ERP", response.getEmpresaAtiva().getNomeFantasia());
    }

    @Test
    @DisplayName("Deve falhar autenticação com senha incorreta")
    void deveFalharComSenhaIncorreta() {
        LoginRequest request = LoginRequest.builder()
                .email("admin@erp.com")
                .senha("senha_errada")
                .build();

        when(usuarioRepository.findByEmail("admin@erp.com")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("senha_errada", "hash_senha")).thenReturn(false);

        assertThrows(BadCredentialsException.class, () -> authService.login(request));
    }

    @Test
    @DisplayName("Deve rejeitar login se usuário não possui vínculo com nenhuma empresa")
    void deveRejeitarLoginSemEmpresaVinculada() {
        LoginRequest request = LoginRequest.builder()
                .email("admin@erp.com")
                .senha("admin123")
                .build();

        when(usuarioRepository.findByEmail("admin@erp.com")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("admin123", "hash_senha")).thenReturn(true);
        when(usuarioEmpresaRepository.findByUsuarioId(1L)).thenReturn(Collections.emptyList());

        assertThrows(BusinessException.class, () -> authService.login(request));
    }
}
