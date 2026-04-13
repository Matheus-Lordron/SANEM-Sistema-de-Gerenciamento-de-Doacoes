USE sanem;

-- ------------------------------------------------------------
-- Categorias de Item
-- ------------------------------------------------------------
-- (já inseridas no DDL, mas caso precise recriar)
INSERT IGNORE INTO categoria_item (nome, descricao) VALUES
  ('Vestuário', 'Roupas em geral'),
  ('Calçado',   'Sapatos, tênis, sandálias'),
  ('Outros',    'Itens diversos');

-- ------------------------------------------------------------
-- Usuários
-- ------------------------------------------------------------
INSERT INTO usuario (nome, email, senha_hash, perfil, ativo) VALUES
  ('Admin Sistema',    'admin@sanem.org',     SHA2('admin123', 256),    'administrador', 1),
  ('Carlos Operador',  'carlos@sanem.org',    SHA2('carlos123', 256),   'operador',      1),
  ('Fernanda Lima',    'fernanda@sanem.org',  SHA2('fernanda123', 256), 'operador',      1),
  ('Ricardo Souza',    'ricardo@sanem.org',   SHA2('ricardo123', 256),  'operador',      0);

-- ------------------------------------------------------------
-- Doadores
-- ------------------------------------------------------------
INSERT INTO doador (tipo, nome_razao_social, cpf_cnpj, telefone, email) VALUES
  ('pessoa_fisica',   'João Pereira',            '123.456.789-01', '(44) 99101-1111', 'joao@email.com'),
  ('pessoa_fisica',   'Maria Aparecida Silva',   '234.567.890-12', '(44) 99202-2222', 'maria@email.com'),
  ('pessoa_fisica',   'Lucas Ferreira',          '345.678.901-23', '(44) 99303-3333', NULL),
  ('pessoa_juridica', 'Roupas & Cia Ltda',       '12.345.678/0001-90', '(44) 3301-4444', 'contato@roupasecia.com'),
  ('pessoa_juridica', 'Supermercado Bem Estar',  '23.456.789/0001-01', '(44) 3302-5555', 'doacao@bemstar.com'),
  ('pessoa_fisica',   'Ana Paula Ramos',         '456.789.012-34', '(44) 99404-6666', 'ana@email.com');

-- ------------------------------------------------------------
-- Beneficiários
-- ------------------------------------------------------------
INSERT INTO beneficiario (nome, cpf, telefone, status) VALUES
  ('Pedro Henrique Costa',   '555.111.222-01', '(44) 98801-0001', 'ativo'),
  ('Juliana Martins',        '555.222.333-02', '(44) 98802-0002', 'ativo'),
  ('Roberto Alves',          '555.333.444-03', '(44) 98803-0003', 'ativo'),
  ('Sônia Rodrigues',        '555.444.555-04', '(44) 98804-0004', 'ativo'),
  ('Marcos Vinícius Lima',   '555.555.666-05', '(44) 98805-0005', 'inativo'),
  ('Carla Mendes',           '555.666.777-06', '(44) 98806-0006', 'ativo'),
  ('Fábio Nascimento',       '555.777.888-07', '(44) 98807-0007', 'ativo'),
  ('Tereza Cristina Borges', '555.888.999-08', '(44) 98808-0008', 'ativo');

-- ------------------------------------------------------------
-- Itens
-- ------------------------------------------------------------
INSERT INTO item (categoria_id, nome, descricao, tamanho, quantidade_estoque) VALUES
  -- Vestuário (categoria_id = 1)
  (1, 'Camiseta',       'Camiseta manga curta',      'P',  0),
  (1, 'Camiseta',       'Camiseta manga curta',      'M',  0),
  (1, 'Camiseta',       'Camiseta manga curta',      'G',  0),
  (1, 'Calça Jeans',    'Calça jeans adulto',        '40', 0),
  (1, 'Calça Jeans',    'Calça jeans adulto',        '42', 0),
  (1, 'Agasalho',       'Agasalho infantil',         '6',  0),
  (1, 'Blusa de Frio',  'Blusa de moletom',          'M',  0),
  (1, 'Vestido',        'Vestido feminino casual',   'P',  0),
  -- Calçados (categoria_id = 2)
  (2, 'Tênis',          'Tênis esportivo',           '38', 0),
  (2, 'Tênis',          'Tênis esportivo',           '40', 0),
  (2, 'Sapato Social',  'Sapato social masculino',   '42', 0),
  (2, 'Sandália',       'Sandália feminina',         '36', 0),
  (2, 'Bota',           'Bota cano curto',           '39', 0),
  -- Outros (categoria_id = 3)
  (3, 'Cobertor',       'Cobertor casal',            NULL, 0),
  (3, 'Toalha',         'Toalha de banho',           NULL, 0),
  (3, 'Mochila',        'Mochila escolar',           NULL, 0);

-- ------------------------------------------------------------
-- Movimentações de ENTRADA (doações recebidas)
-- ------------------------------------------------------------

-- Entrada 1: João Pereira doa roupas (operador Carlos)
INSERT INTO movimentacao (tipo, usuario_id, doador_id, beneficiario_id, observacao) VALUES
  ('entrada', 2, 1, NULL, 'Doação recebida pessoalmente na sede');
SET @mov1 = LAST_INSERT_ID();

INSERT INTO movimentacao_item (movimentacao_id, item_id, quantidade, estado_conservacao) VALUES
  (@mov1, 1,  5, 'otimo'),   -- Camiseta P
  (@mov1, 2,  8, 'bom'),     -- Camiseta M
  (@mov1, 4,  3, 'bom'),     -- Calça Jeans 40
  (@mov1, 7,  4, 'regular'); -- Blusa de Frio M

-- Entrada 2: Roupas & Cia Ltda doa lote grande (operador Fernanda)
INSERT INTO movimentacao (tipo, usuario_id, doador_id, beneficiario_id, observacao) VALUES
  ('entrada', 3, 4, NULL, 'Doação corporativa — campanha do agasalho');
SET @mov2 = LAST_INSERT_ID();

INSERT INTO movimentacao_item (movimentacao_id, item_id, quantidade, estado_conservacao) VALUES
  (@mov2, 3,  10, 'otimo'),  -- Camiseta G
  (@mov2, 5,   6, 'otimo'),  -- Calça Jeans 42
  (@mov2, 6,   8, 'bom'),    -- Agasalho inf. 6
  (@mov2, 8,   5, 'bom'),    -- Vestido P
  (@mov2, 14,  4, 'otimo'),  -- Cobertor
  (@mov2, 16,  3, 'bom');    -- Mochila

-- Entrada 3: Maria Aparecida doa calçados (operador Carlos)
INSERT INTO movimentacao (tipo, usuario_id, doador_id, beneficiario_id, observacao) VALUES
  ('entrada', 2, 2, NULL, 'Calçados em bom estado');
SET @mov3 = LAST_INSERT_ID();

INSERT INTO movimentacao_item (movimentacao_id, item_id, quantidade, estado_conservacao) VALUES
  (@mov3, 9,  4, 'bom'),    -- Tênis 38
  (@mov3, 10, 4, 'otimo'),  -- Tênis 40
  (@mov3, 12, 5, 'bom'),    -- Sandália 36
  (@mov3, 15, 6, 'otimo');  -- Toalha

-- Entrada 4: Supermercado Bem Estar doa mix (admin)
INSERT INTO movimentacao (tipo, usuario_id, doador_id, beneficiario_id, observacao) VALUES
  ('entrada', 1, 5, NULL, 'Parceria mensal com supermercado');
SET @mov4 = LAST_INSERT_ID();

INSERT INTO movimentacao_item (movimentacao_id, item_id, quantidade, estado_conservacao) VALUES
  (@mov4, 11, 3, 'otimo'),  -- Sapato Social 42
  (@mov4, 13, 2, 'bom'),    -- Bota 39
  (@mov4, 14, 6, 'bom'),    -- Cobertor
  (@mov4, 7,  5, 'otimo');  -- Blusa de Frio M

-- Entrada 5: Lucas Ferreira doa peças avulsas (operador Fernanda)
INSERT INTO movimentacao (tipo, usuario_id, doador_id, beneficiario_id, observacao) VALUES
  ('entrada', 3, 3, NULL, 'Doação avulsa, itens variados');
SET @mov5 = LAST_INSERT_ID();

INSERT INTO movimentacao_item (movimentacao_id, item_id, quantidade, estado_conservacao) VALUES
  (@mov5, 1,  3, 'regular'),  -- Camiseta P
  (@mov5, 4,  2, 'bom'),      -- Calça Jeans 40
  (@mov5, 9,  2, 'regular');  -- Tênis 38

-- ------------------------------------------------------------
-- Movimentações de SAÍDA (doações entregues)
-- ------------------------------------------------------------

-- Saída 1: Pedro Henrique recebe roupas
INSERT INTO movimentacao (tipo, usuario_id, doador_id, beneficiario_id, observacao) VALUES
  ('saida', 2, NULL, 1, 'Atendimento mensal — família de 3 pessoas');
SET @sai1 = LAST_INSERT_ID();

INSERT INTO movimentacao_item (movimentacao_id, item_id, quantidade, estado_conservacao) VALUES
  (@sai1, 2,  2, 'bom'),    -- Camiseta M
  (@sai1, 5,  1, 'otimo'),  -- Calça Jeans 42
  (@sai1, 14, 1, 'otimo'),  -- Cobertor
  (@sai1, 10, 1, 'otimo');  -- Tênis 40

-- Saída 2: Juliana Martins recebe roupas e calçados
INSERT INTO movimentacao (tipo, usuario_id, doador_id, beneficiario_id, observacao) VALUES
  ('saida', 3, NULL, 2, 'Primeiro atendimento');
SET @sai2 = LAST_INSERT_ID();

INSERT INTO movimentacao_item (movimentacao_id, item_id, quantidade, estado_conservacao) VALUES
  (@sai2, 8,  1, 'bom'),    -- Vestido P
  (@sai2, 12, 1, 'bom'),    -- Sandália 36
  (@sai2, 15, 1, 'otimo'),  -- Toalha
  (@sai2, 7,  1, 'otimo');  -- Blusa de Frio

-- Saída 3: Roberto Alves recebe agasalhos e mochila
INSERT INTO movimentacao (tipo, usuario_id, doador_id, beneficiario_id, observacao) VALUES
  ('saida', 2, NULL, 3, 'Família com crianças em idade escolar');
SET @sai3 = LAST_INSERT_ID();

INSERT INTO movimentacao_item (movimentacao_id, item_id, quantidade, estado_conservacao) VALUES
  (@sai3, 6,  2, 'bom'),    -- Agasalho inf.
  (@sai3, 16, 1, 'bom'),    -- Mochila
  (@sai3, 1,  2, 'otimo'),  -- Camiseta P
  (@sai3, 9,  1, 'bom');    -- Tênis 38

-- Saída 4: Sônia Rodrigues recebe cobertores e roupas
INSERT INTO movimentacao (tipo, usuario_id, doador_id, beneficiario_id, observacao) VALUES
  ('saida', 1, NULL, 4, 'Atendimento de urgência — família desabrigada');
SET @sai4 = LAST_INSERT_ID();

INSERT INTO movimentacao_item (movimentacao_id, item_id, quantidade, estado_conservacao) VALUES
  (@sai4, 14, 2, 'bom'),    -- Cobertor
  (@sai4, 3,  2, 'otimo'),  -- Camiseta G
  (@sai4, 11, 1, 'otimo'),  -- Sapato Social
  (@sai4, 15, 2, 'otimo');  -- Toalha

-- Saída 5: Carla Mendes recebe roupas variadas
INSERT INTO movimentacao (tipo, usuario_id, doador_id, beneficiario_id, observacao) VALUES
  ('saida', 3, NULL, 6, 'Atendimento padrão mensal');
SET @sai5 = LAST_INSERT_ID();

INSERT INTO movimentacao_item (movimentacao_id, item_id, quantidade, estado_conservacao) VALUES
  (@sai5, 2,  2, 'bom'),    -- Camiseta M
  (@sai5, 4,  1, 'bom'),    -- Calça Jeans 40
  (@sai5, 13, 1, 'bom'),    -- Bota 39
  (@sai5, 7,  1, 'otimo');  -- Blusa de Frio

-- Saída 6: Fábio Nascimento
INSERT INTO movimentacao (tipo, usuario_id, doador_id, beneficiario_id, observacao) VALUES
  ('saida', 2, NULL, 7, 'Atendimento mensal');
SET @sai6 = LAST_INSERT_ID();

INSERT INTO movimentacao_item (movimentacao_id, item_id, quantidade, estado_conservacao) VALUES
  (@sai6, 5,  1, 'otimo'),  -- Calça Jeans 42
  (@sai6, 10, 1, 'otimo'),  -- Tênis 40
  (@sai6, 3,  2, 'otimo'),  -- Camiseta G
  (@sai6, 16, 1, 'bom');    -- Mochila