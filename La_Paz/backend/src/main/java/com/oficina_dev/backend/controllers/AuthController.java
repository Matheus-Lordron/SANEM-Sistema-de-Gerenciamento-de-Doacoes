package com.oficina_dev.backend.controllers;

import com.oficina_dev.backend.models.Voluntary.Voluntary;
import com.oficina_dev.backend.repositories.VoluntaryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder; // 🔥 IMPORTADO
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final VoluntaryRepository voluntaryRepository;
    private final PasswordEncoder passwordEncoder; // 🔥 Injeta o BCrypt do SecurityConfig

    // Construtor para o Spring injetar os componentes automaticamente
    public AuthController(VoluntaryRepository voluntaryRepository, PasswordEncoder passwordEncoder) {
        this.voluntaryRepository = voluntaryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public record LoginRequestDto(String email, String password) {}
    public record LoginResponseDto(String token) {}

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto request) {
        logger.info("Tentativa de login para o email: {}", request.email());

        // 1️⃣ Busca o voluntário no banco através do e-mail vinculado à pessoa
        Optional<Voluntary> voluntaryOptional = voluntaryRepository.findByPersonEmailEmail(request.email());

        if (voluntaryOptional.isPresent()) {
            Voluntary voluntary = voluntaryOptional.get();

            // 2️⃣ Compara a senha digitada no front com a senha criptografada do banco (BCrypt)
            if (passwordEncoder.matches(request.password(), voluntary.getPassword())) {

                logger.info("Login efetuado com sucesso para o usuário do banco de dados!");
                return ResponseEntity.ok(new LoginResponseDto("token-jwt-super-seguro-12345"));
            }
        }

        logger.warn("Falha no login: credenciais incorretas.");
        return ResponseEntity.status(401).body("Utilizador ou password incorretos");
    }
}
