package com.erp.arquivo.service;

import com.erp.arquivo.domain.Arquivo;
import com.erp.arquivo.dto.ArquivoDto;
import com.erp.arquivo.repository.ArquivoRepository;
import com.erp.cliente.repository.ClienteRepository;
import com.erp.comum.exception.BusinessException;
import com.erp.comum.exception.ResourceNotFoundException;
import com.erp.comum.multitenancy.TenantContext;
import com.erp.empresa.repository.EmpresaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ArquivoService {

    private final ArquivoRepository arquivoRepository;
    private final EmpresaRepository empresaRepository;
    private final ClienteRepository clienteRepository;

    @Transactional
    public ArquivoDto salvarArquivo(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException("Nenhum arquivo foi enviado ou o arquivo está vazio.");
        }

        String nomeOriginal = file.getOriginalFilename();
        if (nomeOriginal == null || nomeOriginal.trim().isEmpty()) {
            nomeOriginal = "arquivo_sem_nome";
        } else {
            nomeOriginal = nomeOriginal.trim();
        }

        String extensao = extrairExtensao(nomeOriginal);

        String tipoMime = file.getContentType();
        if (tipoMime == null || tipoMime.trim().isEmpty()) {
            tipoMime = "application/octet-stream";
        }

        Long tamanho = file.getSize();
        byte[] bytes;
        try {
            bytes = file.getBytes();
        } catch (IOException e) {
            log.error("Erro ao ler os bytes do arquivo: {}", nomeOriginal, e);
            throw new BusinessException("Falha ao processar o arquivo enviado: " + e.getMessage());
        }

        Long empresaId = TenantContext.getTenantId();

        Arquivo arquivo = Arquivo.builder()
                .empresaId(empresaId)
                .nome(nomeOriginal)
                .extensao(extensao)
                .tipo(tipoMime)
                .tamanho(tamanho)
                .dados(bytes)
                .build();

        Arquivo salvo = arquivoRepository.save(arquivo);
        log.info("Arquivo salvo com sucesso ID: {}, Nome: {}, Tamanho: {} bytes", salvo.getId(), salvo.getNome(), salvo.getTamanho());

        return ArquivoDto.fromEntity(salvo);
    }

    @Transactional(readOnly = true)
    public Arquivo buscarPorId(Long id) {
        return arquivoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Arquivo não encontrado com ID: " + id));
    }

    @Transactional(readOnly = true)
    public ArquivoDto buscarDtoPorId(Long id) {
        if (id == null) {
            return null;
        }
        Arquivo arquivo = buscarPorId(id);
        return ArquivoDto.fromEntity(arquivo);
    }

    @Transactional
    public void deletar(Long id) {
        if (id == null) {
            return;
        }
        Optional<Arquivo> arquivoOpt = arquivoRepository.findById(id);
        if (arquivoOpt.isPresent()) {
            empresaRepository.desvincularArquivo(id);
            clienteRepository.desvincularArquivo(id);
            arquivoRepository.delete(arquivoOpt.get());
            log.info("Arquivo desvinculado e excluído com sucesso ID: {}", id);
        }
    }

    private String extrairExtensao(String nomeArquivo) {
        if (nomeArquivo == null) {
            return "bin";
        }
        int ultimoPonto = nomeArquivo.lastIndexOf('.');
        if (ultimoPonto >= 0 && ultimoPonto < nomeArquivo.length() - 1) {
            return nomeArquivo.substring(ultimoPonto + 1).toLowerCase();
        }
        return "bin";
    }
}
