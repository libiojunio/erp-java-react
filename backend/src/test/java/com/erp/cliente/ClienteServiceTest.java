package com.erp.cliente;

import com.erp.cliente.domain.Cliente;
import com.erp.cliente.dto.ClienteEnderecoDto;
import com.erp.cliente.dto.ClienteRequest;
import com.erp.cliente.dto.ClienteResponse;
import com.erp.cliente.repository.ClienteRepository;
import com.erp.cliente.service.ClienteService;
import com.erp.comum.exception.BusinessException;
import com.erp.comum.multitenancy.TenantContext;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClienteServiceTest {

    @Mock
    private ClienteRepository clienteRepository;

    @Mock
    private com.erp.arquivo.service.ArquivoService arquivoService;

    @InjectMocks
    private ClienteService clienteService;

    @BeforeEach
    void setUp() {
        TenantContext.setTenantId(1L);
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    @DisplayName("Deve cadastrar cliente PJ com sucesso quando dados forem válidos")
    void deveCadastrarClientePjComSucesso() {
        ClienteRequest request = ClienteRequest.builder()
                .tipoPessoa("PJ")
                .documento("11.222.333/0001-44") // Note: se precisar de um CNPJ com dígito verificador matemático válido
                .documento("12345678000195")
                .nomeRazaoSocial("CLIENTE TESTE PJ LTDA")
                .nomeFantasia("Cliente Teste")
                .enderecos(List.of(
                        ClienteEnderecoDto.builder()
                                .tipo("PRINCIPAL")
                                .cep("01310100")
                                .logradouro("Av Paulista")
                                .numero("1000")
                                .bairro("Bela Vista")
                                .cidade("São Paulo")
                                .uf("SP")
                                .build()
                ))
                .build();

        when(clienteRepository.existsByEmpresaIdAndDocumento(1L, "12345678000195")).thenReturn(false);
        when(clienteRepository.save(any(Cliente.class))).thenAnswer(invocation -> {
            Cliente c = invocation.getArgument(0);
            c.setId(10L);
            return c;
        });

        ClienteResponse response = clienteService.criar(request);

        assertNotNull(response);
        assertEquals(10L, response.getId());
        assertEquals("CLIENTE TESTE PJ LTDA", response.getNomeRazaoSocial());
        assertEquals("12345678000195", response.getDocumento());
    }

    @Test
    @DisplayName("Deve falhar ao cadastrar cliente PF com CPF inválido")
    void deveFalharClientePfCpfInvalido() {
        ClienteRequest request = ClienteRequest.builder()
                .tipoPessoa("PF")
                .documento("111.111.111-11") // dígitos repetidos inválidos
                .nomeRazaoSocial("Fulano de Tal")
                .build();

        BusinessException ex = assertThrows(BusinessException.class, () -> clienteService.criar(request));
        assertTrue(ex.getMessage().contains("CPF informado é inválido"));
    }

    @Test
    @DisplayName("Deve falhar quando nenhum endereço for marcado como PRINCIPAL")
    void deveFalharQuandoNaoHouverEnderecoPrincipal() {
        ClienteRequest request = ClienteRequest.builder()
                .tipoPessoa("PJ")
                .documento("12345678000195")
                .nomeRazaoSocial("CLIENTE TESTE PJ")
                .enderecos(List.of(
                        ClienteEnderecoDto.builder()
                                .tipo("COBRANCA")
                                .cep("01310100")
                                .logradouro("Rua X")
                                .numero("10")
                                .bairro("Bairro")
                                .cidade("SP")
                                .uf("SP")
                                .build()
                ))
                .build();

        BusinessException ex = assertThrows(BusinessException.class, () -> clienteService.criar(request));
        assertTrue(ex.getMessage().contains("PRINCIPAL"));
    }

    @Test
    @DisplayName("Deve falhar ao tentar cadastrar cliente com documento duplicado na mesma empresa")
    void deveFalharDocumentoDuplicadoNaEmpresa() {
        ClienteRequest request = ClienteRequest.builder()
                .tipoPessoa("PJ")
                .documento("12345678000195")
                .nomeRazaoSocial("EMPRESA DUPLICADA")
                .build();

        when(clienteRepository.existsByEmpresaIdAndDocumento(1L, "12345678000195")).thenReturn(true);

        BusinessException ex = assertThrows(BusinessException.class, () -> clienteService.criar(request));
        assertTrue(ex.getMessage().contains("Já existe um cliente cadastrado com este documento"));
    }

    @Test
    @DisplayName("Deve buscar cliente por ID com seus detalhes")
    void deveBuscarPorIdComDetalhes() {
        Cliente cliente = Cliente.builder()
                .id(1L)
                .empresaId(1L)
                .tipoPessoa("PJ")
                .documento("12345678000195")
                .nomeRazaoSocial("CLIENTE COM DETALHES")
                .situacao("ATIVO")
                .build();

        when(clienteRepository.findWithDetailsByIdAndEmpresaId(1L, 1L)).thenReturn(java.util.Optional.of(cliente));

        ClienteResponse response = clienteService.buscarPorId(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("CLIENTE COM DETALHES", response.getNomeRazaoSocial());
    }

    @Test
    @DisplayName("Deve deletar cliente e excluir seu arquivo vinculado logo após na mesma chamada")
    void deveDeletarClienteEArquivoVinculado() {
        Cliente cliente = Cliente.builder()
                .id(1L)
                .empresaId(1L)
                .tipoPessoa("PJ")
                .documento("12345678000195")
                .nomeRazaoSocial("CLIENTE COM ARQUIVO")
                .arquivoId(99L)
                .build();

        when(clienteRepository.findByIdAndEmpresaId(1L, 1L)).thenReturn(java.util.Optional.of(cliente));

        clienteService.deletar(1L);

        verify(clienteRepository, times(1)).delete(cliente);
        verify(arquivoService, times(1)).deletar(99L);
    }
}
