package com.oficina_dev.backend.controllers;

import com.oficina_dev.backend.models.Voluntary.Voluntary;
import com.oficina_dev.backend.repositories.VoluntaryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final VoluntaryRepository voluntaryRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtEncoder jwtEncoder;

    public AuthController(VoluntaryRepository voluntaryRepository,
                          PasswordEncoder passwordEncoder,
                          JwtEncoder jwtEncoder) {
        this.voluntaryRepository = voluntaryRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtEncoder = jwtEncoder;
    }

    public record LoginRequestDto(String email, String password) {}
    public record LoginResponseDto(String token) {}

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto request) {
        logger.info("Tentativa de login para o email: {}", request.email());

        Optional<Voluntary> voluntaryOptional = voluntaryRepository.findByPersonEmailEmail(request.email());

        if (voluntaryOptional.isPresent()) {
            Voluntary voluntary = voluntaryOptional.get();

            if (passwordEncoder.matches(request.password(), voluntary.getPassword())) {
                Instant now = Instant.now();
                JwtClaimsSet claims = JwtClaimsSet.builder()
                        .issuer("sanem-backend")
                        .issuedAt(now)
                        .expiresAt(now.plusSeconds(86400)) // 24h
                        .subject(voluntary.getId().toString())
                        .claim("email", request.email())
                        .build();

                String token = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
                logger.info("Login efetuado com sucesso!");
                return ResponseEntity.ok(new LoginResponseDto(token));
            }
        }

        logger.warn("Falha no login: credenciais incorretas.");
        return ResponseEntity.status(401).body("Utilizador ou password incorretos");
    }
}