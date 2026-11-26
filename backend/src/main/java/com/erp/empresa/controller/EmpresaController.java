package com.erp.empresa.controller;

import com.erp.comum.dto.ApiResponse;
import com.erp.empresa.dto.AlterarSituacaoRequest;
import com.erp.empresa.dto.EmpresaFiltroForm;
import com.erp.empresa.dto.EmpresaRequest;
import com.erp.empresa.dto.EmpresaResponse;
import com.erp.empresa.service.EmpresaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empresas")
@RequiredArgsConstructor
@Tag(name = "Empresas", description = "Endpoints para gerenciamento do cadastro de empresas (Restrito ao perfil ADMIN)")
@PreAuthorize("hasRole('ADMIN')")
public class EmpresaController {

    private final EmpresaService empresaService;

    @GetMapping
    @Operation(summary = "Lista todas as empresas cadastradas com suporte a formulário de busca e paginação")
    public ResponseEntity<ApiResponse<List<EmpresaResponse>>> listar(@ParameterObject EmpresaFiltroForm filtroForm) {
        Page<EmpresaResponse> pageResult = empresaService.listar(filtroForm);
        return ResponseEntity.ok(ApiResponse.sucesso(pageResult.getContent()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca detalhes de uma empresa específica por ID")
    public ResponseEntity<ApiResponse<EmpresaResponse>> buscarPorId(@PathVariable Long id) {
        EmpresaResponse response = empresaService.buscarPorId(id);
        return ResponseEntity.ok(ApiResponse.sucesso(response));
    }

    @PostMapping
    @Operation(summary = "Cadastra uma nova empresa no sistema")
    public ResponseEntity<ApiResponse<EmpresaResponse>> criar(@Valid @RequestBody EmpresaRequest request) {
        EmpresaResponse response = empresaService.criar(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.sucesso("Empresa cadastrada com sucesso", response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualiza os dados de uma empresa existente")
    public ResponseEntity<ApiResponse<EmpresaResponse>> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody EmpresaRequest request
    ) {
        EmpresaResponse response = empresaService.atualizar(id, request);
        return ResponseEntity.ok(ApiResponse.sucesso("Empresa atualizada com sucesso", response));
    }

    @PatchMapping("/{id}/situacao")
    @Operation(summary = "Inativa ou ativa uma empresa (exclusão lógica sem deleção física)")
    public ResponseEntity<ApiResponse<EmpresaResponse>> alterarSituacao(
            @PathVariable Long id,
            @Valid @RequestBody AlterarSituacaoRequest request
    ) {
        EmpresaResponse response = empresaService.alterarSituacao(id, request.getSituacao());
        String mensagem;
        if ("ATIVO".equalsIgnoreCase(request.getSituacao())) {
            mensagem = "Empresa reativada com sucesso";
        } else {
            mensagem = "Empresa inativada com sucesso";
        }
        return ResponseEntity.ok(ApiResponse.sucesso(mensagem, response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Exclui uma empresa e seu arquivo vinculado")
    public ResponseEntity<ApiResponse<Void>> deletar(@PathVariable Long id) {
        empresaService.deletar(id);
        return ResponseEntity.ok(ApiResponse.sucesso("Empresa excluída com sucesso", null));
    }
}
