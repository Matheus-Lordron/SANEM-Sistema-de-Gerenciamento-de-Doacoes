package com.oficina_dev.backend.models.Person;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.oficina_dev.backend.models.Address.Address;
import com.oficina_dev.backend.models.Cpf.Cpf;
import com.oficina_dev.backend.models.Email.Email;
import com.oficina_dev.backend.models.Giver.Giver;
import com.oficina_dev.backend.models.Receiver.Receiver;
import com.oficina_dev.backend.models.Voluntary.Voluntary;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.ZonedDateTime;
import java.util.UUID;

@Getter
@Entity
@Table(name = "tb_people", schema = "Public")
public class Person {

    @Id
    @Setter
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @Column(name = "phone", length = 15, nullable = false)
    private String phone;

    @Embedded
    private Cpf cpf;

    @Embedded
    private Email email;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private ZonedDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;

    @Setter
    @OneToOne
    @JoinColumn(name = "id_address", referencedColumnName = "id", unique = true)
    private Address address;

    @OneToOne(mappedBy = "person")
    @JsonBackReference // 🚀 Protege contra loops caso liste Givers
    private Giver giver;

    @OneToOne(mappedBy = "person")
    @JsonBackReference // 🚀 FECHA O CIRCUITO COM VOLUNTARY! Evita o loop infinito e o erro 500
    private Voluntary voluntary;

    @OneToOne(mappedBy = "person")
    @JsonBackReference // 🚀 Protege contra loops caso liste Receivers
    private Receiver receiver;

    public Person(){
        // Default constructor for JPA
    }

    public Person(String name, String phone, String cpf, String email, Address address) {
        this.setName(name);
        this.setPhone(phone);
        this.cpf = new Cpf(cpf);
        this.email = new Email(email);
        this.setAddress(address);
    }

    public String getCpf() {
        // 🚀 Se o objeto cpf for nulo, retorna "Não informado" em vez de quebrar o sistema
        return (this.cpf != null) ? this.cpf.getCpf() : "Não informado";
    }

    public String getEmail() {
        // 🚀 Se o objeto email for nulo, retorna "Não informado" em vez de quebrar o sistema
        return (this.email != null) ? this.email.getEmail() : "Não informado";
    }

    public void setName(String name) {
        this.name = name.toLowerCase().trim();
    }

    public void setPhone(String phone) {
        this.phone = phone.replaceAll("[()\\-\\s]", ""); // Remove all non-digit characters
    }

    public void setCpf(String cpf) {
        this.cpf.setCpf(cpf);
    }

    public void setEmail(String email) {
        this.email.setEmail(email);
    }

    // 🚀 Removidos as referências cíclicas do toString para evitar StackOverflow no console do Java
    @Override
    public String toString() {
        return "Person{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", phone='" + phone + '\'' +
                ", cpf=" + (cpf != null ? cpf.getCpf() : null) +
                ", email=" + (email != null ? email.getEmail() : null) +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}