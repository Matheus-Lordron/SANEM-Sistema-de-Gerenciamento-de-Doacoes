package com.oficina_dev.backend.configs; // ⚠️ Ajuste o pacote de acordo com a sua pasta

import com.oficina_dev.backend.models.Person.Person;
import com.oficina_dev.backend.models.Voluntary.Voluntary;
import com.oficina_dev.backend.repositories.PersonRepository;       // ⚠️ Ajuste seus imports se necessário
import com.oficina_dev.backend.repositories.VoluntaryRepository;    // ⚠️ Ajuste seus imports se necessário
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final VoluntaryRepository voluntaryRepository;
    private final PersonRepository personRepository;
    private final PasswordEncoder passwordEncoder; // 🔥 Crucial para salvar a senha criptografada corretamente

    // O Spring injeta automaticamente os repositórios e o codificador de senha
    public DatabaseSeeder(VoluntaryRepository voluntaryRepository,
                          PersonRepository personRepository,
                          PasswordEncoder passwordEncoder) {
        this.voluntaryRepository = voluntaryRepository;
        this.personRepository = personRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1️⃣ Se a tabela de voluntários estiver completamente vazia...
        if (voluntaryRepository.count() == 0) {
            System.out.println("🌱 Banco de dados vazio! Criando usuário Administrador padrão...");

            // 2️⃣ Cria primeiro a entidade Person (conforme o construtor que vimos)
            // Person(String name, String phone, String cpf, String email, Address address)
            Person adminPerson = new Person(
                    "Administrador Geral",
                    "41999999999",
                    "00000000000",
                    "admin@sanem.com",
                    null // Endereço pode começar nulo
            );

            // Salva a pessoa no banco para gerar o ID
            personRepository.save(adminPerson);

            // 3️⃣ Criptografa a senha desejada (ex: admin123) usando o padrão do sistema
            String senhaCriptografada = passwordEncoder.encode("admin123");

            // 4️⃣ Cria o Voluntário associando a pessoa e a senha protegida
            Voluntary adminVoluntary = new Voluntary(adminPerson, senhaCriptografada, true);

            // Salva o voluntário definitivo
            voluntaryRepository.save(adminVoluntary);

            System.out.println("🚀 Administrador criado com sucesso!");
            System.out.println("👉 E-mail: admin@sanem.com | Senha: admin123");
        }
    }
}
