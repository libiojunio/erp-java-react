package com.erp.cliente.dto;

import com.erp.cliente.domain.ClienteEndereco;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClienteEnderecoDto {

    private Long id;

    @NotBlank(message = "O tipo do endereço é obrigatório (ex: PRINCIPAL, COBRANCA, ENTREGA)")
    private String tipo;

    @NotBlank(message = "O CEP é obrigatório")
    private String cep;

    @NotBlank(message = "O logradouro é obrigatório")
    private String logradouro;

    @NotBlank(message = "O número é obrigatório")
    private String numero;

    private String complemento;

    @NotBlank(message = "O bairro é obrigatório")
    private String bairro;

    @NotBlank(message = "A cidade é obrigatória")
    private String cidade;

    @NotBlank(message = "A UF é obrigatória")
    @Size(min = 2, max = 2, message = "UF deve ter 2 caracteres")
    private String uf;

    public static ClienteEnderecoDto fromEntity(ClienteEndereco endereco) {
        if (endereco == null) return null;
        return ClienteEnderecoDto.builder()
                .id(endereco.getId())
                .tipo(endereco.getTipo())
                .cep(endereco.getCep())
                .logradouro(endereco.getLogradouro())
                .numero(endereco.getNumero())
                .complemento(endereco.getComplemento())
                .bairro(endereco.getBairro())
                .cidade(endereco.getCidade())
                .uf(endereco.getUf())
                .build();
    }

    public ClienteEndereco toEntity() {
        String tipoFormatado = "PRINCIPAL";
        if (this.tipo != null) {
            tipoFormatado = this.tipo.toUpperCase();
        }

        String cepLimpo = "";
        if (this.cep != null) {
            cepLimpo = this.cep.replaceAll("\\D", "");
        }

        String ufFormatada = "";
        if (this.uf != null) {
            ufFormatada = this.uf.toUpperCase();
        }

        return ClienteEndereco.builder()
                .id(this.id)
                .tipo(tipoFormatado)
                .cep(cepLimpo)
                .logradouro(this.logradouro)
                .numero(this.numero)
                .complemento(this.complemento)
                .bairro(this.bairro)
                .cidade(this.cidade)
                .uf(ufFormatada)
                .build();
    }
}
