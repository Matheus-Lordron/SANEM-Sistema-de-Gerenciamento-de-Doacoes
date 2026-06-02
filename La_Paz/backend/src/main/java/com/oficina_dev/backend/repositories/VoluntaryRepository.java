package com.oficina_dev.backend.repositories;

import com.oficina_dev.backend.models.Voluntary.Voluntary;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface VoluntaryRepository extends JpaRepository<Voluntary, UUID> {

    // 🚀 O duplo "Email" diz ao JPA: entre em Person, pegue o objeto Email e busque pelo texto interno dele!
    Optional<Voluntary> findByPersonEmailEmail(String email);
}