package com.erp.seguranca;

import com.erp.seguranca.jwt.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(
                jwtService,
                "jwtSecret",
                "dGhpc0lzQVZlcnlTZWN1cmVTZWNyZXRLZXlGb3JFUlBNdWx0aWVtcHJlc2EyMDI2ISE="
        );
        ReflectionTestUtils.setField(jwtService, "jwtExpirationMs", 3600000L);
    }

    @Test
    @DisplayName("Deve gerar e validar token JWT com claims corretas")
    void deveGerarEValidarTokenComSucesso() {
        Long usuarioId = 10L;
        String email = "admin@erp.com";
        String nome = "Administrador Master";
        Long empresaId = 1L;
        List<String> perfis = List.of("ROLE_ADMIN", "ROLE_OPERADOR");

        String token = jwtService.gerarToken(usuarioId, email, nome, empresaId, perfis);

        assertNotNull(token);
        assertTrue(jwtService.isTokenValido(token));
        assertEquals(email, jwtService.extrairEmail(token));
        assertEquals(usuarioId, jwtService.extrairUsuarioId(token));
        assertEquals(empresaId, jwtService.extrairEmpresaId(token));
        assertEquals(perfis, jwtService.extrairPerfis(token));
    }
}
