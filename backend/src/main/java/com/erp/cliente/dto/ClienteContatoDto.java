package com.erp.cliente.dto;

import com.erp.cliente.domain.ClienteContato;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClienteContatoDto {

    private Long id;

    @NotBlank(message = "O nome do contato é obrigatório")
    private String nome;

    private String cargo;

    private String email;

    private String telefone;

    public static ClienteContatoDto fromEntity(ClienteContato contato) {
        if (contato == null) {
            return null;
        }
        return ClienteContatoDto.builder()
                .id(contato.getId())
                .nome(contato.getNome())
                .cargo(contato.getCargo())
                .email(contato.getEmail())
                .telefone(contato.getTelefone())
                .build();
    }

    public ClienteContato toEntity() {
        return ClienteContato.builder()
                .id(this.id)
                .nome(this.nome)
                .cargo(this.cargo)
                .email(this.email)
                .telefone(this.telefone)
                .build();
    }
}
