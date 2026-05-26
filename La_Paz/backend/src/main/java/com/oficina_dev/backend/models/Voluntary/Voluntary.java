package com.oficina_dev.backend.models.Voluntary;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.oficina_dev.backend.models.Donation.Donation;
import com.oficina_dev.backend.models.Person.Person;
import com.oficina_dev.backend.models.Transfer.Transfer;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Entity
@NoArgsConstructor
@Table(name = "tb_voluntaries")
public class Voluntary {

    @Id
    @Setter
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private ZonedDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;

    @Setter // 🚀 Adicionado para permitir setar/atualizar a pessoa se necessário
    @OneToOne
    @JoinColumn(name = "id_person", referencedColumnName = "id")
    @JsonManagedReference // 🚀 Evita a recursão infinita (erro 500) ao serializar para JSON
    private Person person;

    @OneToMany(mappedBy = "voluntary")
    private List<Donation> donations;

    @OneToMany(mappedBy = "voluntary")
    private List<Transfer> transfers;

    public Voluntary(Person person, String password, Boolean isActive) {
        this.setPassword(password);
        this.isActive = isActive;
        this.person = person;
    }

    public void setPassword(String password) {
        if(password == null || password.isBlank()) {
            throw new IllegalArgumentException("Password cannot be null or blank");
        }
        this.password = password;
    }

    public void setActive(boolean b) {
        this.isActive = b;
    }
}
