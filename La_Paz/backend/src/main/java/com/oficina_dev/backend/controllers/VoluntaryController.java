package com.oficina_dev.backend.controllers;

import com.oficina_dev.backend.dtos.Voluntary.VoluntaryRequestDto;
import com.oficina_dev.backend.dtos.Voluntary.VoluntaryResponseDto;
import com.oficina_dev.backend.dtos.Voluntary.VoluntaryRemovedResponseDto;
import com.oficina_dev.backend.services.VoluntaryService;
import jakarta.validation.Valid;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;

@RestController
@RequestMapping("/api/voluntaries")
@CrossOrigin(origins = "http://localhost:3000") // Liberação geral
public class VoluntaryController {
    private static final Logger logger = LoggerFactory.getLogger(VoluntaryController.class);

    @Autowired
    private VoluntaryService voluntaryService;

    @GetMapping
    @CrossOrigin(origins = "http://localhost:3000") // 🚀 ADICIONE ISSO AQUI PARA GARANTIR!
    public ResponseEntity<List<VoluntaryResponseDto>> getAll() {
        logger.info("Fetching all voluntaries");
        List<VoluntaryResponseDto> voluntaryResponseDto = this.voluntaryService.getAll();
        logger.info("Returning {} voluntaries", voluntaryResponseDto.size());
        return ResponseEntity.ok(voluntaryResponseDto);
    }
    @PostMapping // Rota ajustada para combinar com a chamada do Front-end
    public ResponseEntity<VoluntaryResponseDto> create(@RequestBody @Valid VoluntaryRequestDto voluntaryRequestDto) {
        logger.info("Creating new voluntary");
        VoluntaryResponseDto voluntaryResponseDto = this.voluntaryService.create(voluntaryRequestDto);
        logger.info("Voluntary created successfully with ID: {}", voluntaryResponseDto.id());
        return ResponseEntity.ok(voluntaryResponseDto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VoluntaryResponseDto> update(@PathVariable UUID id, @RequestBody @Valid VoluntaryRequestDto voluntaryRequestDto) {
        logger.info("Updating voluntary with ID: {}", id);
        VoluntaryResponseDto voluntaryResponseDto = this.voluntaryService.update(id, voluntaryRequestDto);
        logger.info("Voluntary updated successfully with ID: {}", voluntaryResponseDto.id());
        return ResponseEntity.ok(voluntaryResponseDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<VoluntaryRemovedResponseDto> delete(@PathVariable UUID id) {
        logger.info("Removing voluntary with ID: {}", id);
        VoluntaryRemovedResponseDto voluntaryRemovedResponseDto = this.voluntaryService.delete(id);
        logger.info("Voluntary removed successfully with ID: {}", voluntaryRemovedResponseDto.id());
        return ResponseEntity.ok(voluntaryRemovedResponseDto);
    }
}
