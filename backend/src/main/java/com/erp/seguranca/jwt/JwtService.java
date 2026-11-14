package com.erp.seguranca.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${app.jwt.secret:dGhpc0lzQVZlcnlTZWN1cmVTZWNyZXRLZXlGb3JFUlBNdWx0aWVtcHJlc2EyMDI2ISE=}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms:86400000}")
    private long jwtExpirationMs;

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String gerarToken(Long usuarioId, String email, String nome, Long empresaId, List<String> perfis) {
        Date agora = new Date();
        Date dataExpiracao = new Date(agora.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .subject(email)
                .claim("usuarioId", usuarioId)
                .claim("nome", nome)
                .claim("empresaId", empresaId)
                .claim("perfis", perfis)
                .issuedAt(agora)
                .expiration(dataExpiracao)
                .signWith(getSigningKey())
                .compact();
    }

    public String extrairEmail(String token) {
        return extrairClaim(token, Claims::getSubject);
    }

    public Long extrairUsuarioId(String token) {
        Claims claims = extrairTodosClaims(token);
        Number id = claims.get("usuarioId", Number.class);
        return id != null ? id.longValue() : null;
    }

    public Long extrairEmpresaId(String token) {
        Claims claims = extrairTodosClaims(token);
        Number id = claims.get("empresaId", Number.class);
        return id != null ? id.longValue() : null;
    }

    @SuppressWarnings("unchecked")
    public List<String> extrairPerfis(String token) {
        Claims claims = extrairTodosClaims(token);
        return claims.get("perfis", List.class);
    }

    public <T> T extrairClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extrairTodosClaims(token);
        return claimsResolver.apply(claims);
    }

    public Claims extrairTodosClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isTokenValido(String token, String userEmail) {
        try {
            final String email = extrairEmail(token);
            return (email.equals(userEmail) && !isTokenExpirado(token));
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public boolean isTokenValido(String token) {
        try {
            return !isTokenExpirado(token);
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private boolean isTokenExpirado(String token) {
        return extrairClaim(token, Claims::getExpiration).before(new Date());
    }
}
