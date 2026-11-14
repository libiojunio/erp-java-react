package com.erp.seguranca.jwt;

import com.erp.comum.multitenancy.TenantContext;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);

        try {
            if (jwtService.isTokenValido(jwt)) {
                final String userEmail = jwtService.extrairEmail(jwt);
                final Long empresaId = jwtService.extrairEmpresaId(jwt);
                final List<String> perfis = jwtService.extrairPerfis(jwt);

                // Configura a empresa ativa no contexto multi-tenant para a requisição
                if (empresaId != null) {
                    TenantContext.setTenantId(empresaId);
                }

                if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

                    List<SimpleGrantedAuthority> authorities;
                    if (perfis != null && !perfis.isEmpty()) {
                        authorities = perfis.stream()
                                .map(SimpleGrantedAuthority::new)
                                .collect(Collectors.toList());
                    } else {
                        authorities = userDetails.getAuthorities().stream()
                                .map(a -> new SimpleGrantedAuthority(a.getAuthority()))
                                .collect(Collectors.toList());
                    }

                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            authorities
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            log.error("Não foi possível autenticar o usuário via JWT: {}", e.getMessage());
        }

        try {
            filterChain.doFilter(request, response);
        } finally {
            // Garante a limpeza do contexto multi-tenant ao término da requisição
            TenantContext.clear();
        }
    }
}
