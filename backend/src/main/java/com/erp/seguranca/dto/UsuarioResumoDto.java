package com.erp.seguranca.dto;

import com.erp.seguranca.domain.Perfil;
import com.erp.seguranca.domain.Usuario;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioResumoDto {

    private Long id;
    private String nome;
    private String email;
    private List<String> perfis;

    public static UsuarioResumoDto fromEntity(Usuario usuario) {
        if (usuario == null) return null;
        List<String> perfisNomes = usuario.getPerfis().stream()
                .map(Perfil::getNome)
                .collect(Collectors.toList());

        return UsuarioResumoDto.builder()
                .id(usuario.getId())
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .perfis(perfisNomes)
                .build();
    }
}
