package com.erp.cliente.controller;

import com.erp.cliente.dto.*;
import com.erp.cliente.service.ClienteService;
import com.erp.comum.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
@Tag(name = "Clientes", description = "Endpoints para gerenciamento do cadastro de clientes (PF e PJ)")
public class ClienteController {

    private final ClienteService clienteService;

    @GetMapping
    @Operation(summary = "Lista clientes da empresa ativa com suporte a busca, filtro por situação e paginação")
    public ResponseEntity<ApiResponse<Page<ClienteResponse>>> listarClientes(
            @RequestParam(required = false) String termo,
            @RequestParam(required = false) String situacao,
            @PageableDefault(size = 10, sort = "nomeRazaoSocial") Pageable pageable) {

        Page<ClienteResponse> pagina = clienteService.listarPaginado(termo, situacao, pageable);
        return ResponseEntity.ok(ApiResponse.sucesso(pagina));
    }

    @GetMapping("/todos")
    @Operation(summary = "Lista todos os clientes da empresa ativa sem paginação")
    public ResponseEntity<ApiResponse<List<ClienteResponse>>> listarTodos() {
        List<ClienteResponse> clientes = clienteService.listarTodos();
        return ResponseEntity.ok(ApiResponse.sucesso(clientes));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca detalhes de um cliente da empresa ativa")
    public ResponseEntity<ApiResponse<ClienteResponse>> buscarPorId(@PathVariable Long id) {
        ClienteResponse cliente = clienteService.buscarPorId(id);
        return ResponseEntity.ok(ApiResponse.sucesso(cliente));
    }

    @PostMapping
    @Operation(summary = "Cadastra um novo cliente para a empresa ativa")
    public ResponseEntity<ApiResponse<ClienteResponse>> criar(@Valid @RequestBody ClienteRequest request) {
        ClienteResponse criado = clienteService.criar(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.sucesso("Cliente cadastrado com sucesso!", criado));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualiza os dados de um cliente existente")
    public ResponseEntity<ApiResponse<ClienteResponse>> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody ClienteRequest request) {
        ClienteResponse atualizado = clienteService.atualizar(id, request);
        return ResponseEntity.ok(ApiResponse.sucesso("Cliente atualizado com sucesso!", atualizado));
    }

    @PatchMapping("/{id}/situacao")
    @Operation(summary = "Inativa ou reativa um cliente (exclusão lógica)")
    public ResponseEntity<ApiResponse<ClienteResponse>> alterarSituacao(
            @PathVariable Long id,
            @Valid @RequestBody AlterarSituacaoClienteRequest request) {
        ClienteResponse atualizado = clienteService.alterarSituacao(id, request.getSituacao());
        String msg;
        if ("ATIVO".equalsIgnoreCase(request.getSituacao())) {
            msg = "Cliente reativado com sucesso!";
        } else {
            msg = "Cliente inativado com sucesso!";
        }
        return ResponseEntity.ok(ApiResponse.sucesso(msg, atualizado));
    }
}
