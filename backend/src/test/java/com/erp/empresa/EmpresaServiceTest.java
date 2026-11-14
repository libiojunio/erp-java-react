package com.erp.empresa;

import com.erp.comum.exception.BusinessException;
import com.erp.empresa.domain.Empresa;
import com.erp.empresa.dto.EmpresaRequest;
import com.erp.empresa.dto.EmpresaResponse;
import com.erp.empresa.repository.EmpresaRepository;
import com.erp.empresa.service.EmpresaService;
import com.erp.seguranca.repository.UsuarioEmpresaRepository;
import com.erp.seguranca.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmpresaServiceTest {

    @Mock
    private EmpresaRepository empresaRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private UsuarioEmpresaRepository usuarioEmpresaRepository;

    @InjectMocks
    private EmpresaService empresaService;

    private Empresa empresa;

    @BeforeEach
    void setUp() {
        empresa = Empresa.builder()
                .id(1L)
                .razaoSocial("NOVA EMPRESA TESTE LTDA")
                .nomeFantasia("Empresa Teste")
                .cnpj("12345678000195")
                .situacao("ATIVO")
                .build();
    }

    @Test
    @DisplayName("Deve cadastrar uma empresa com CNPJ válido")
    void deveCadastrarEmpresaComSucesso() {
        EmpresaRequest request = EmpresaRequest.builder()
                .razaoSocial("NOVA EMPRESA TESTE LTDA")
                .nomeFantasia("Empresa Teste")
                .cnpj("12.345.678/0001-95")
                .build();

        when(empresaRepository.existsByCnpj(anyString())).thenReturn(false);
        when(empresaRepository.save(any(Empresa.class))).thenReturn(empresa);

        EmpresaResponse response = empresaService.criar(request);

        assertNotNull(response);
        assertEquals("NOVA EMPRESA TESTE LTDA", response.getRazaoSocial());
        assertEquals("ATIVO", response.getSituacao());
        verify(empresaRepository, times(1)).save(any(Empresa.class));
    }

    @Test
    @DisplayName("Deve rejeitar cadastro com CNPJ inválido")
    void deveRejeitarCnpjInvalido() {
        EmpresaRequest request = EmpresaRequest.builder()
                .razaoSocial("EMPRESA INVALIDA")
                .cnpj("11.111.111/1111-11") // Dígitos repetidos
                .build();

        assertThrows(BusinessException.class, () -> empresaService.criar(request));
        verify(empresaRepository, never()).save(any(Empresa.class));
    }

    @Test
    @DisplayName("Deve rejeitar cadastro de CNPJ duplicado")
    void deveRejeitarCnpjDuplicado() {
        EmpresaRequest request = EmpresaRequest.builder()
                .razaoSocial("EMPRESA DUPLICADA")
                .cnpj("12.345.678/0001-95")
                .build();

        when(empresaRepository.existsByCnpj("12345678000195")).thenReturn(true);

        assertThrows(BusinessException.class, () -> empresaService.criar(request));
        verify(empresaRepository, never()).save(any(Empresa.class));
    }

    @Test
    @DisplayName("Deve inativar empresa com exclusão lógica")
    void deveInativarEmpresaComSucesso() {
        when(empresaRepository.findById(1L)).thenReturn(Optional.of(empresa));
        when(empresaRepository.save(any(Empresa.class))).thenReturn(empresa);

        EmpresaResponse response = empresaService.alterarSituacao(1L, "INATIVO");

        assertNotNull(response);
        assertEquals("INATIVO", empresa.getSituacao());
        verify(empresaRepository, times(1)).save(empresa);
    }
}
