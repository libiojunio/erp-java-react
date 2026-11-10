package com.erp.comum.controller;

import com.erp.comum.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/status")
@Tag(name = "Status", description = "Verificação de disponibilidade do backend")
public class HealthController {

    @GetMapping
    @Operation(summary = "Verifica se a API está online")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStatus() {
        Map<String, Object> status = Map.of(
                "status", "UP",
                "versao", "0.1.0",
                "modulo", "ERP Multiempresa - Base"
        );
        return ResponseEntity.ok(ApiResponse.sucesso("API operacional", status));
    }
}
