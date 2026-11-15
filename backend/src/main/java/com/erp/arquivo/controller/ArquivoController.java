package com.erp.arquivo.controller;

import com.erp.arquivo.domain.Arquivo;
import com.erp.arquivo.dto.ArquivoDto;
import com.erp.arquivo.service.ArquivoService;
import com.erp.comum.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/arquivos")
@RequiredArgsConstructor
@Tag(name = "Arquivos", description = "Endpoints para upload, download e gerenciamento de arquivos (PDF, imagens, TXT, etc.)")
public class ArquivoController {

    private final ArquivoService arquivoService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Realiza o upload de um arquivo e armazena no banco de dados")
    public ResponseEntity<ApiResponse<ArquivoDto>> upload(@RequestParam("file") MultipartFile file) {
        ArquivoDto salvo = arquivoService.salvarArquivo(file);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.sucesso("Arquivo enviado com sucesso!", salvo));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Retorna os metadados de um arquivo por ID")
    public ResponseEntity<ApiResponse<ArquivoDto>> buscarMetadados(@PathVariable Long id) {
        ArquivoDto dto = arquivoService.buscarDtoPorId(id);
        return ResponseEntity.ok(ApiResponse.sucesso(dto));
    }

    @GetMapping("/{id}/conteudo")
    @Operation(summary = "Retorna o conteúdo binário do arquivo para visualização ou download")
    public ResponseEntity<byte[]> obterConteudo(@PathVariable Long id) {
        Arquivo arquivo = arquivoService.buscarPorId(id);

        MediaType mediaType;
        try {
            mediaType = MediaType.parseMediaType(arquivo.getTipo());
        } catch (Exception e) {
            mediaType = MediaType.APPLICATION_OCTET_STREAM;
        }

        String contentDisposition = "inline; filename=\"" + arquivo.getNome() + "\"";

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
                .body(arquivo.getDados());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Exclui um arquivo pelo ID")
    public ResponseEntity<ApiResponse<Void>> deletar(@PathVariable Long id) {
        arquivoService.deletar(id);
        return ResponseEntity.ok(ApiResponse.sucesso("Arquivo excluído com sucesso!", null));
    }
}
