package com.erp.arquivo.dto;

import com.erp.arquivo.domain.Arquivo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArquivoDto {

    private Long id;
    private String nome;
    private String extensao;
    private String tipo;
    private Long tamanho;
    private String urlDownload;

    public static ArquivoDto fromEntity(Arquivo arquivo) {
        if (arquivo == null) {
            return null;
        }

        String url = null;
        if (arquivo.getId() != null) {
            url = "/api/arquivos/" + arquivo.getId() + "/conteudo";
        }

        return ArquivoDto.builder()
                .id(arquivo.getId())
                .nome(arquivo.getNome())
                .extensao(arquivo.getExtensao())
                .tipo(arquivo.getTipo())
                .tamanho(arquivo.getTamanho())
                .urlDownload(url)
                .build();
    }
}
