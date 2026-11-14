package com.erp.seguranca.controller;

import com.erp.comum.dto.ApiResponse;
import com.erp.seguranca.dto.LoginRequest;
import com.erp.seguranca.dto.LoginResponse;
import com.erp.seguranca.dto.TrocaEmpresaRequest;
import com.erp.seguranca.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticação", description = "Endpoints para autenticação e gestão de sessão multiempresa")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Realiza o login e retorna o token JWT com empresa padrão e permissões")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.sucesso("Login realizado com sucesso", response));
    }

    @PostMapping("/empresa-ativa")
    @Operation(summary = "Troca a empresa ativa da sessão e gera um novo token JWT")
    public ResponseEntity<ApiResponse<LoginResponse>> trocarEmpresaAtiva(@Valid @RequestBody TrocaEmpresaRequest request) {
        LoginResponse response = authService.trocarEmpresaAtiva(request.getEmpresaId());
        return ResponseEntity.ok(ApiResponse.sucesso("Empresa ativa alterada com sucesso", response));
    }

    @GetMapping("/me")
    @Operation(summary = "Obtém os dados do usuário autenticado e a empresa ativa da sessão")
    public ResponseEntity<ApiResponse<LoginResponse>> obterUsuarioLogado() {
        LoginResponse response = authService.obterUsuarioAutenticado();
        return ResponseEntity.ok(ApiResponse.sucesso(response));
    }
}
