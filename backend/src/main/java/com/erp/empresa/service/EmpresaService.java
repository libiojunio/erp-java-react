package com.erp.empresa.service;

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

    @Transactional(readOnly = true)
    public Page<EmpresaResponse> listar(String filtro, String situacao, Pageable pageable) {
        log.info("Listando empresas com filtro: '{}', situacao: '{}'", filtro, situacao);
        return empresaRepository.buscarComFiltros(filtro, situacao, pageable)
                .map(EmpresaResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public List<EmpresaResponse> listarTodas() {
        return empresaRepository.findAll().stream()
                .map(EmpresaResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EmpresaResponse buscarPorId(Long id) {
        Empresa empresa = empresaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Empresa não encontrada com ID: " + id));
        return EmpresaResponse.fromEntity(empresa);
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

        Empresa empresa = Empresa.builder()
                .razaoSocial(request.getRazaoSocial().trim())
                .nomeFantasia(request.getNomeFantasia() != null ? request.getNomeFantasia().trim() : null)
                .cnpj(cnpjLimpo)
                .inscricaoEstadual(request.getInscricaoEstadual())
                .cep(request.getCep() != null ? request.getCep().replaceAll("\\D", "") : null)
                .logradouro(request.getLogradouro())
                .numero(request.getNumero())
                .complemento(request.getComplemento())
                .bairro(request.getBairro())
                .cidade(request.getCidade())
                .uf(request.getUf() != null ? request.getUf().toUpperCase() : null)
                .situacao("ATIVO")
                .build();

        empresa = empresaRepository.save(empresa);
        log.info("Empresa criada com sucesso ID: {}, CNPJ: {}", empresa.getId(), empresa.getCnpj());

        // Vincula a nova empresa ao usuário logado para que ele possa acessá-la imediatamente
        vincularAoUsuarioLogado(empresa);

        return EmpresaResponse.fromEntity(empresa);
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
        empresa.setNomeFantasia(request.getNomeFantasia() != null ? request.getNomeFantasia().trim() : null);
        empresa.setCnpj(cnpjLimpo);
        empresa.setInscricaoEstadual(request.getInscricaoEstadual());
        empresa.setCep(request.getCep() != null ? request.getCep().replaceAll("\\D", "") : null);
        empresa.setLogradouro(request.getLogradouro());
        empresa.setNumero(request.getNumero());
        empresa.setComplemento(request.getComplemento());
        empresa.setBairro(request.getBairro());
        empresa.setCidade(request.getCidade());
        empresa.setUf(request.getUf() != null ? request.getUf().toUpperCase() : null);

        empresa = empresaRepository.save(empresa);
        log.info("Empresa atualizada com sucesso ID: {}", empresa.getId());

        return EmpresaResponse.fromEntity(empresa);
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

        return EmpresaResponse.fromEntity(empresa);
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
