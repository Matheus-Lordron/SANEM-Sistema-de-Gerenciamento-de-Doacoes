package com.oficina_dev.backend.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    // DTO (Objeto) para receber o e-mail e password do front-end
    public record LoginRequestDto(String email, String password) {}

    // DTO (Objeto) para devolver o token ao front-end
    public record LoginResponseDto(String token) {}

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto request) {
        logger.info("Tentativa de login para o email: {}", request.email());

        // LÓGICA DE VALIDAÇÃO (Por agora, vamos validar com o utilizador que criámos na base de dados manual)
        // Futuramente, substituiremos isto por uma pesquisa real na base de dados (Repository)
        if ("admin@sanem.com".equals(request.email()) && "1234".equals(request.password())) {

            logger.info("Login efetuado com sucesso!");
            // Devolve um token simulado que o front-end precisa para prosseguir
            return ResponseEntity.ok(new LoginResponseDto("token-jwt-super-seguro-12345"));

        }

        logger.warn("Falha no login: credenciais incorretas.");
        // Devolve o erro 401 que o front-end está à espera para mostrar "Utilizador ou password incorretos"
        return ResponseEntity.status(401).body("Utilizador ou password incorretos");
    }
}
