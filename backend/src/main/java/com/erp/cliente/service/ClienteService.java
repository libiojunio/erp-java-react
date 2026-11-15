package com.erp.cliente.service;

import com.erp.arquivo.dto.ArquivoDto;
import com.erp.arquivo.service.ArquivoService;
import com.erp.cliente.domain.Cliente;
import com.erp.cliente.domain.ClienteContato;
import com.erp.cliente.domain.ClienteEndereco;
import com.erp.cliente.dto.*;
import com.erp.cliente.repository.ClienteRepository;
import com.erp.comum.exception.BusinessException;
import com.erp.comum.exception.ResourceNotFoundException;
import com.erp.comum.multitenancy.TenantContext;
import com.erp.comum.validation.CnpjValidator;
import com.erp.comum.validation.CpfValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final ArquivoService arquivoService;

    @Transactional(readOnly = true)
    public Page<ClienteResponse> listarPaginado(String termo, String situacao, Pageable pageable) {
        Long empresaId = obterEmpresaAtivaId();

        String termoBusca = null;
        if (termo != null && !termo.trim().isEmpty()) {
            termoBusca = termo.trim();
        }

        String termoLimpo = null;
        if (termoBusca != null) {
            termoLimpo = termoBusca.replaceAll("\\D", "");
        }

        String situacaoFiltro = null;
        if (situacao != null && !situacao.trim().isEmpty() && !situacao.equalsIgnoreCase("TODOS")) {
            situacaoFiltro = situacao.toUpperCase().trim();
        }

        log.debug("Pesquisando clientes da empresa ID {}: termo={}, situacao={}", empresaId, termoBusca, situacaoFiltro);

        return clienteRepository.pesquisarClientes(empresaId, termoBusca, termoLimpo, situacaoFiltro, pageable)
                .map(this::carregarResponse);
    }

    @Transactional(readOnly = true)
    public List<ClienteResponse> listarTodos() {
        Long empresaId = obterEmpresaAtivaId();
        return clienteRepository.findByEmpresaId(empresaId).stream()
                .map(this::carregarResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ClienteResponse buscarPorId(Long id) {
        Long empresaId = obterEmpresaAtivaId();
        Cliente cliente = clienteRepository.findWithDetailsByIdAndEmpresaId(id, empresaId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com ID: " + id));

        return carregarResponse(cliente);
    }

    @Transactional
    public ClienteResponse criar(ClienteRequest request) {
        Long empresaId = obterEmpresaAtivaId();
        validarDadosCliente(request, null, empresaId);

        String docLimpo = request.getDocumento().replaceAll("\\D", "");

        String nomeFantasia = null;
        if (request.getNomeFantasia() != null) {
            nomeFantasia = request.getNomeFantasia().trim();
        }

        String inscricaoEstadual = null;
        if (request.getInscricaoEstadual() != null) {
            inscricaoEstadual = request.getInscricaoEstadual().trim();
        }

        String email = null;
        if (request.getEmail() != null) {
            email = request.getEmail().trim();
        }

        String telefone = null;
        if (request.getTelefone() != null) {
            telefone = request.getTelefone().replaceAll("\\D", "");
        }

        Cliente cliente = Cliente.builder()
                .empresaId(empresaId)
                .tipoPessoa(request.getTipoPessoa().toUpperCase())
                .documento(docLimpo)
                .nomeRazaoSocial(request.getNomeRazaoSocial().trim())
                .nomeFantasia(nomeFantasia)
                .inscricaoEstadual(inscricaoEstadual)
                .dataNascimento(request.getDataNascimento())
                .email(email)
                .telefone(telefone)
                .arquivoId(request.getArquivoId())
                .situacao("ATIVO")
                .build();

        if (request.getEnderecos() != null) {
            for (ClienteEnderecoDto endDto : request.getEnderecos()) {
                ClienteEndereco end = endDto.toEntity();
                cliente.adicionarEndereco(end);
            }
        }

        if (request.getContatos() != null) {
            for (ClienteContatoDto ctoDto : request.getContatos()) {
                ClienteContato cto = ctoDto.toEntity();
                cliente.adicionarContato(cto);
            }
        }

        Cliente salvo = clienteRepository.save(cliente);
        log.info("Cliente criado com sucesso: ID={}, Nome={}, EmpresaID={}", salvo.getId(), salvo.getNomeRazaoSocial(), empresaId);
        return carregarResponse(salvo);
    }

    @Transactional
    public ClienteResponse atualizar(Long id, ClienteRequest request) {
        Long empresaId = obterEmpresaAtivaId();
        Cliente cliente = clienteRepository.findWithDetailsByIdAndEmpresaId(id, empresaId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com ID: " + id));

        validarDadosCliente(request, id, empresaId);

        String docLimpo = request.getDocumento().replaceAll("\\D", "");

        cliente.setTipoPessoa(request.getTipoPessoa().toUpperCase());
        cliente.setDocumento(docLimpo);
        cliente.setNomeRazaoSocial(request.getNomeRazaoSocial().trim());

        if (request.getNomeFantasia() != null) {
            cliente.setNomeFantasia(request.getNomeFantasia().trim());
        } else {
            cliente.setNomeFantasia(null);
        }

        if (request.getInscricaoEstadual() != null) {
            cliente.setInscricaoEstadual(request.getInscricaoEstadual().trim());
        } else {
            cliente.setInscricaoEstadual(null);
        }

        cliente.setDataNascimento(request.getDataNascimento());

        if (request.getEmail() != null) {
            cliente.setEmail(request.getEmail().trim());
        } else {
            cliente.setEmail(null);
        }

        if (request.getTelefone() != null) {
            cliente.setTelefone(request.getTelefone().replaceAll("\\D", ""));
        } else {
            cliente.setTelefone(null);
        }

        cliente.setArquivoId(request.getArquivoId());

        // Atualizar endereços (orphanRemoval gerencia a exclusão dos que não estão mais presentes)
        cliente.getEnderecos().clear();
        if (request.getEnderecos() != null) {
            for (ClienteEnderecoDto endDto : request.getEnderecos()) {
                ClienteEndereco end = endDto.toEntity();
                cliente.adicionarEndereco(end);
            }
        }

        // Atualizar contatos
        cliente.getContatos().clear();
        if (request.getContatos() != null) {
            for (ClienteContatoDto ctoDto : request.getContatos()) {
                ClienteContato cto = ctoDto.toEntity();
                cliente.adicionarContato(cto);
            }
        }

        Cliente atualizado = clienteRepository.save(cliente);
        log.info("Cliente atualizado com sucesso: ID={}, EmpresaID={}", atualizado.getId(), empresaId);
        return carregarResponse(atualizado);
    }

    @Transactional
    public ClienteResponse alterarSituacao(Long id, String novaSituacao) {
        Long empresaId = obterEmpresaAtivaId();
        Cliente cliente = clienteRepository.findByIdAndEmpresaId(id, empresaId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com ID: " + id));

        cliente.setSituacao(novaSituacao.toUpperCase().trim());
        Cliente salvo = clienteRepository.save(cliente);
        log.info("Situação do cliente ID={} alterada para: {}", id, salvo.getSituacao());
        return carregarResponse(salvo);
    }

    private ClienteResponse carregarResponse(Cliente cliente) {
        if (cliente == null) {
            return null;
        }
        ArquivoDto arquivoDto = null;
        if (cliente.getArquivoId() != null) {
            try {
                arquivoDto = arquivoService.buscarDtoPorId(cliente.getArquivoId());
            } catch (Exception e) {
                log.warn("Arquivo ID {} não encontrado para cliente ID {}", cliente.getArquivoId(), cliente.getId());
            }
        }
        return ClienteResponse.fromEntity(cliente, arquivoDto);
    }

    private void validarDadosCliente(ClienteRequest request, Long clienteId, Long empresaId) {
        String tipo = request.getTipoPessoa();
        String docLimpo = "";
        if (request.getDocumento() != null) {
            docLimpo = request.getDocumento().replaceAll("\\D", "");
        }

        if ("PF".equalsIgnoreCase(tipo)) {
            if (docLimpo.length() != 11 || !CpfValidator.isValid(docLimpo)) {
                throw new BusinessException("CPF informado é inválido: " + request.getDocumento());
            }
            if (request.getDataNascimento() != null && request.getDataNascimento().isAfter(LocalDate.now())) {
                throw new BusinessException("Data de nascimento não pode ser no futuro");
            }
        } else if ("PJ".equalsIgnoreCase(tipo)) {
            if (docLimpo.length() != 14 || !CnpjValidator.isValid(docLimpo)) {
                throw new BusinessException("CNPJ informado é inválido: " + request.getDocumento());
            }
        } else {
            throw new BusinessException("Tipo de pessoa deve ser PF ou PJ");
        }

        // Unicidade na empresa
        if (clienteId == null) {
            if (clienteRepository.existsByEmpresaIdAndDocumento(empresaId, docLimpo)) {
                throw new BusinessException("Já existe um cliente cadastrado com este documento (" + request.getDocumento() + ") nesta empresa.");
            }
        } else {
            if (clienteRepository.existsByEmpresaIdAndDocumentoAndIdNot(empresaId, docLimpo, clienteId)) {
                throw new BusinessException("Já existe outro cliente cadastrado com este documento (" + request.getDocumento() + ") nesta empresa.");
            }
        }

        // Regra de múltiplos endereços: se houver endereços, pelo menos um deve ser PRINCIPAL
        if (request.getEnderecos() != null && !request.getEnderecos().isEmpty()) {
            long principais = request.getEnderecos().stream()
                    .filter(e -> "PRINCIPAL".equalsIgnoreCase(e.getTipo()))
                    .count();
            if (principais == 0) {
                throw new BusinessException("É obrigatório informar ao menos um endereço com o tipo 'PRINCIPAL'.");
            }
        }
    }

    private Long obterEmpresaAtivaId() {
        Long empresaId = TenantContext.getTenantId();
        if (empresaId == null) {
            throw new BusinessException("Nenhuma empresa ativa identificada na sessão");
        }
        return empresaId;
    }
}
