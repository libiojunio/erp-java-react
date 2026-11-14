package com.erp.cliente.service;

import com.erp.cliente.domain.Cliente;
import com.erp.cliente.dto.ClienteDto;
import com.erp.cliente.repository.ClienteRepository;
import com.erp.comum.exception.BusinessException;
import com.erp.comum.exception.ResourceNotFoundException;
import com.erp.comum.multitenancy.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClienteService {

    private final ClienteRepository clienteRepository;

    @Transactional(readOnly = true)
    public List<ClienteDto> listarClientesDaEmpresaAtiva() {
        Long empresaId = obterEmpresaAtivaId();
        log.info("Listando clientes isolados para a empresa ID: {}", empresaId);

        return clienteRepository.findByEmpresaId(empresaId).stream()
                .map(ClienteDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ClienteDto buscarPorId(Long id) {
        Long empresaId = obterEmpresaAtivaId();
        Cliente cliente = clienteRepository.findByIdAndEmpresaId(id, empresaId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com ID: " + id));

        return ClienteDto.fromEntity(cliente);
    }

    private Long obterEmpresaAtivaId() {
        Long empresaId = TenantContext.getTenantId();
        if (empresaId == null) {
            throw new BusinessException("Nenhuma empresa ativa identificada na sessão");
        }
        return empresaId;
    }
}
