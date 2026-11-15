package com.erp.empresa.service;

import com.erp.arquivo.dto.ArquivoDto;
import com.erp.arquivo.service.ArquivoService;
import com.erp.comum.exception.BusinessException;
import com.erp.comum.exception.ResourceNotFoundException;
import com.erp.comum.validation.CnpjValidator;
import com.erp.empresa.domain.Empresa;
import com.erp.empresa.dto.EmpresaRequest;
import com.erp.empresa.dto.EmpresaResponse;
import com.erp.empresa.repository.EmpresaRepository;
import com.erp.seguranca.domain.Usuario;
import com.erp.seguranca.domain.UsuarioEmpresa;
import com.erp.seguranca.repository.UsuarioEmpresaRepository;
import com.erp.seguranca.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmpresaService {

    private final EmpresaRepository empresaRepository;
    private final UsuarioRepository usuarioRepository;
    private final UsuarioEmpresaRepository usuarioEmpresaRepository;
    private final ArquivoService arquivoService;

    @Transactional(readOnly = true)
    public Page<EmpresaResponse> listar(String filtro, String situacao, Pageable pageable) {
        log.info("Listando empresas com filtro: '{}', situacao: '{}'", filtro, situacao);
        return empresaRepository.buscarComFiltros(filtro, situacao, pageable)
                .map(this::carregarResponse);
    }

    @Transactional(readOnly = true)
    public List<EmpresaResponse> listarTodas() {
        return empresaRepository.findAll().stream()
                .map(this::carregarResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EmpresaResponse buscarPorId(Long id) {
        Empresa empresa = empresaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Empresa não encontrada com ID: " + id));
        return carregarResponse(empresa);
    }

    @Transactional
    public EmpresaResponse criar(EmpresaRequest request) {
        String cnpjLimpo = normalizarCnpj(request.getCnpj());

        if (!CnpjValidator.isValido(cnpjLimpo)) {
            throw new BusinessException("O CNPJ informado é inválido");
        }

        if (empresaRepository.existsByCnpj(cnpjLimpo)) {
            throw new BusinessException("Já existe uma empresa cadastrada com o CNPJ informado");
        }

        String nomeFantasia = null;
        if (request.getNomeFantasia() != null) {
            nomeFantasia = request.getNomeFantasia().trim();
        }

        String cep = null;
        if (request.getCep() != null) {
            cep = request.getCep().replaceAll("\\D", "");
        }

        String uf = null;
        if (request.getUf() != null) {
            uf = request.getUf().toUpperCase();
        }

        Empresa empresa = Empresa.builder()
                .razaoSocial(request.getRazaoSocial().trim())
                .nomeFantasia(nomeFantasia)
                .cnpj(cnpjLimpo)
                .inscricaoEstadual(request.getInscricaoEstadual())
                .cep(cep)
                .logradouro(request.getLogradouro())
                .numero(request.getNumero())
                .complemento(request.getComplemento())
                .bairro(request.getBairro())
                .cidade(request.getCidade())
                .uf(uf)
                .arquivoId(request.getArquivoId())
                .situacao("ATIVO")
                .build();

        empresa = empresaRepository.save(empresa);
        log.info("Empresa criada com sucesso ID: {}, CNPJ: {}", empresa.getId(), empresa.getCnpj());

        // Vincula a nova empresa ao usuário logado para que ele possa acessá-la imediatamente
        vincularAoUsuarioLogado(empresa);

        return carregarResponse(empresa);
    }

    @Transactional
    public EmpresaResponse atualizar(Long id, EmpresaRequest request) {
        Empresa empresa = empresaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Empresa não encontrada com ID: " + id));

        String cnpjLimpo = normalizarCnpj(request.getCnpj());

        if (!CnpjValidator.isValido(cnpjLimpo)) {
            throw new BusinessException("O CNPJ informado é inválido");
        }

        if (empresaRepository.existsByCnpjAndIdNot(cnpjLimpo, id)) {
            throw new BusinessException("Outra empresa já está cadastrada com este CNPJ");
        }

        empresa.setRazaoSocial(request.getRazaoSocial().trim());

        if (request.getNomeFantasia() != null) {
            empresa.setNomeFantasia(request.getNomeFantasia().trim());
        } else {
            empresa.setNomeFantasia(null);
        }

        empresa.setCnpj(cnpjLimpo);
        empresa.setInscricaoEstadual(request.getInscricaoEstadual());

        if (request.getCep() != null) {
            empresa.setCep(request.getCep().replaceAll("\\D", ""));
        } else {
            empresa.setCep(null);
        }

        empresa.setLogradouro(request.getLogradouro());
        empresa.setNumero(request.getNumero());
        empresa.setComplemento(request.getComplemento());
        empresa.setBairro(request.getBairro());
        empresa.setCidade(request.getCidade());

        if (request.getUf() != null) {
            empresa.setUf(request.getUf().toUpperCase());
        } else {
            empresa.setUf(null);
        }

        empresa.setArquivoId(request.getArquivoId());

        empresa = empresaRepository.save(empresa);
        log.info("Empresa atualizada com sucesso ID: {}", empresa.getId());

        return carregarResponse(empresa);
    }

    @Transactional
    public EmpresaResponse alterarSituacao(Long id, String novaSituacao) {
        if (!"ATIVO".equalsIgnoreCase(novaSituacao) && !"INATIVO".equalsIgnoreCase(novaSituacao)) {
            throw new BusinessException("A situação deve ser ATIVO ou INATIVO");
        }

        Empresa empresa = empresaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Empresa não encontrada com ID: " + id));

        empresa.setSituacao(novaSituacao.toUpperCase());
        empresa = empresaRepository.save(empresa);
        log.info("Situação da empresa ID {} alterada para: {}", empresa.getId(), empresa.getSituacao());

        return carregarResponse(empresa);
    }

    private EmpresaResponse carregarResponse(Empresa empresa) {
        if (empresa == null) {
            return null;
        }
        ArquivoDto arquivoDto = null;
        if (empresa.getArquivoId() != null) {
            try {
                arquivoDto = arquivoService.buscarDtoPorId(empresa.getArquivoId());
            } catch (Exception e) {
                log.warn("Arquivo ID {} não encontrado para empresa ID {}", empresa.getArquivoId(), empresa.getId());
            }
        }
        return EmpresaResponse.fromEntity(empresa, arquivoDto);
    }

    private String normalizarCnpj(String cnpj) {
        if (cnpj == null) return "";
        return cnpj.replaceAll("\\D", "");
    }

    private void vincularAoUsuarioLogado(Empresa empresa) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated()) {
                usuarioRepository.findByEmail(auth.getName()).ifPresent(usuario -> {
                    boolean jaExiste = usuarioEmpresaRepository
                            .findByUsuarioIdAndEmpresaId(usuario.getId(), empresa.getId())
                            .isPresent();
                    if (!jaExiste) {
                        usuarioEmpresaRepository.save(UsuarioEmpresa.builder()
                                .usuario(usuario)
                                .empresa(empresa)
                                .padrao(0)
                                .build());
                        log.info("Empresa ID {} vinculada automaticamente ao usuário {}", empresa.getId(), usuario.getEmail());
                    }
                });
            }
        } catch (Exception e) {
            log.warn("Não foi possível vincular a empresa criada ao usuário da sessão: {}", e.getMessage());
        }
    }
}
