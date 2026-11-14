package com.erp.cliente.controller;

import com.erp.cliente.dto.ClienteDto;
import com.erp.cliente.service.ClienteService;
import com.erp.comum.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
@Tag(name = "Clientes", description = "Endpoints para gerenciamento do cadastro de clientes")
public class ClienteController {

    private final ClienteService clienteService;

    @GetMapping
    @Operation(summary = "Lista todos os clientes da empresa ativa na sessão")
    public ResponseEntity<ApiResponse<List<ClienteDto>>> listarClientes() {
        List<ClienteDto> clientes = clienteService.listarClientesDaEmpresaAtiva();
        return ResponseEntity.ok(ApiResponse.sucesso(clientes));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca detalhes de um cliente da empresa ativa")
    public ResponseEntity<ApiResponse<ClienteDto>> buscarPorId(@PathVariable Long id) {
        ClienteDto cliente = clienteService.buscarPorId(id);
        return ResponseEntity.ok(ApiResponse.sucesso(cliente));
    }
}
