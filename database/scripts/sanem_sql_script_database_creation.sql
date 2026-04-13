CREATE DATABASE sanem
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE sanem;

SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE categoria_item (
  id        INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome      VARCHAR(50)  NOT NULL,
  descricao VARCHAR(255) NULL,
  CONSTRAINT pk_categoria_item PRIMARY KEY (id),
  CONSTRAINT uq_categoria_nome UNIQUE (nome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO categoria_item (nome, descricao) VALUES
  ('Vestuário', 'Roupas em geral'),
  ('Calçado',   'Sapatos, tênis, sandálias'),
  ('Outros',    'Itens diversos');
  
  
  CREATE TABLE usuario (
  id          INT UNSIGNED                        NOT NULL AUTO_INCREMENT,
  nome        VARCHAR(100)                        NOT NULL,
  email       VARCHAR(150)                        NOT NULL,
  senha_hash  VARCHAR(255)                        NOT NULL,
  perfil      ENUM('administrador', 'operador')   NOT NULL,
  ativo       TINYINT(1)                          NOT NULL DEFAULT 1,
  criado_em   DATETIME                            NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_usuario   PRIMARY KEY (id),
  CONSTRAINT uq_usuario_email UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE doador (
  id               INT UNSIGNED                              NOT NULL AUTO_INCREMENT,
  tipo             ENUM('pessoa_fisica', 'pessoa_juridica')  NOT NULL,
  nome_razao_social VARCHAR(150)                            NOT NULL,
  cpf_cnpj         VARCHAR(18)                             NOT NULL,
  telefone         VARCHAR(20)                              NULL,
  email            VARCHAR(150)                             NULL,
  criado_em        DATETIME                                 NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_doador          PRIMARY KEY (id),
  CONSTRAINT uq_doador_cpf_cnpj UNIQUE (cpf_cnpj)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE beneficiario (
  id        INT UNSIGNED               NOT NULL AUTO_INCREMENT,
  nome      VARCHAR(100)               NOT NULL,
  cpf       VARCHAR(14)                NOT NULL,
  telefone  VARCHAR(20)                NULL,
  status    ENUM('ativo', 'inativo')   NOT NULL DEFAULT 'ativo',
  criado_em DATETIME                   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_beneficiario     PRIMARY KEY (id),
  CONSTRAINT uq_beneficiario_cpf UNIQUE (cpf)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  
  
  CREATE TABLE item (
  id                 INT UNSIGNED NOT NULL AUTO_INCREMENT,
  categoria_id       INT UNSIGNED NOT NULL,
  nome               VARCHAR(100) NOT NULL,
  descricao          VARCHAR(255) NULL,
  tamanho            VARCHAR(20)  NULL,
  quantidade_estoque INT UNSIGNED NOT NULL DEFAULT 0,  -- RN03: UNSIGNED impede negativo
  criado_em          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_item          PRIMARY KEY (id),
  CONSTRAINT fk_item_categoria FOREIGN KEY (categoria_id)
    REFERENCES categoria_item (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_item_categoria (categoria_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  
  
CREATE TABLE movimentacao (
  id                INT UNSIGNED              NOT NULL AUTO_INCREMENT,
  tipo              ENUM('entrada', 'saida')  NOT NULL,
  usuario_id        INT UNSIGNED              NOT NULL,
  doador_id         INT UNSIGNED              NULL,
  beneficiario_id   INT UNSIGNED              NULL,
  data_movimentacao DATETIME                  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  observacao        TEXT                      NULL,
  CONSTRAINT pk_movimentacao PRIMARY KEY (id),
  CONSTRAINT fk_mov_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuario (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_mov_doador FOREIGN KEY (doador_id)
    REFERENCES doador (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_mov_beneficiario FOREIGN KEY (beneficiario_id)
    REFERENCES beneficiario (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_mov_usuario      (usuario_id),
  INDEX idx_mov_doador       (doador_id),
  INDEX idx_mov_beneficiario (beneficiario_id),
  INDEX idx_mov_tipo_data    (tipo, data_movimentacao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  
  DELIMITER $$

CREATE TRIGGER trg_consistencia_movimentacao
BEFORE INSERT ON movimentacao
FOR EACH ROW
BEGIN
  IF NEW.tipo = 'entrada' AND NEW.doador_id IS NULL THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Movimentação de entrada exige um doador_id.';
  END IF;

  IF NEW.tipo = 'saida' AND NEW.beneficiario_id IS NULL THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Movimentação de saída exige um beneficiario_id.';
  END IF;
END$$

DELIMITER ;


CREATE TABLE movimentacao_item (
  id               INT UNSIGNED                                        NOT NULL AUTO_INCREMENT,
  movimentacao_id  INT UNSIGNED                                        NOT NULL,
  item_id          INT UNSIGNED                                        NOT NULL,
  quantidade       INT UNSIGNED                                        NOT NULL,
  estado_conservacao ENUM('otimo','bom','regular','mau_estado')        NOT NULL,
  CONSTRAINT pk_movimentacao_item PRIMARY KEY (id),
  CONSTRAINT fk_mi_movimentacao FOREIGN KEY (movimentacao_id)
    REFERENCES movimentacao (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_mi_item FOREIGN KEY (item_id)
    REFERENCES item (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT chk_mi_quantidade CHECK (quantidade > 0),
  INDEX idx_mi_movimentacao (movimentacao_id),
  INDEX idx_mi_item         (item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

DELIMITER $$

CREATE TRIGGER trg_rn01_bloqueia_mau_estado
BEFORE INSERT ON movimentacao_item
FOR EACH ROW
BEGIN
  DECLARE v_tipo ENUM('entrada','saida');

  SELECT tipo INTO v_tipo
    FROM movimentacao
   WHERE id = NEW.movimentacao_id;

  IF v_tipo = 'entrada' AND NEW.estado_conservacao = 'mau_estado' THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'RN01: Itens em mau estado não podem ser registrados como entrada no estoque.';
  END IF;
END$$

DELIMITER $$

CREATE TRIGGER trg_rn02_beneficiario_ativo
BEFORE INSERT ON movimentacao
FOR EACH ROW
BEGIN
  DECLARE v_status ENUM('ativo','inativo');

  IF NEW.tipo = 'saida' THEN
    SELECT status INTO v_status
      FROM beneficiario
     WHERE id = NEW.beneficiario_id;

    IF v_status <> 'ativo' THEN
      SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'RN02: A doação só pode ser entregue a beneficiários com status ativo.';
    END IF;
  END IF;
END$$

DELIMITER $$
CREATE TRIGGER trg_rn03_atualiza_estoque
AFTER INSERT ON movimentacao_item
FOR EACH ROW
BEGIN
  DECLARE v_tipo         ENUM('entrada','saida');
  DECLARE v_estoque_atual INT UNSIGNED;

  SELECT tipo INTO v_tipo
    FROM movimentacao
   WHERE id = NEW.movimentacao_id;

  IF v_tipo = 'entrada' THEN
    UPDATE item
       SET quantidade_estoque = quantidade_estoque + NEW.quantidade
     WHERE id = NEW.item_id;

  ELSEIF v_tipo = 'saida' THEN
    SELECT quantidade_estoque INTO v_estoque_atual
      FROM item
     WHERE id = NEW.item_id
       FOR UPDATE;  -- lock para concorrência

    IF v_estoque_atual < NEW.quantidade THEN
      SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'RN03: Operação negada — estoque insuficiente para este item.';
    END IF;

    UPDATE item
       SET quantidade_estoque = quantidade_estoque - NEW.quantidade
     WHERE id = NEW.item_id;
  END IF;
END$$

DELIMITER $$

CREATE TRIGGER trg_rn04_limite_mensal_beneficiario
BEFORE INSERT ON movimentacao_item
FOR EACH ROW
BEGIN
  DECLARE v_tipo          ENUM('entrada','saida');
  DECLARE v_beneficiario  INT UNSIGNED;
  DECLARE v_total_mes     INT UNSIGNED;

  SELECT tipo, beneficiario_id
    INTO v_tipo, v_beneficiario
    FROM movimentacao
   WHERE id = NEW.movimentacao_id;

  IF v_tipo = 'saida' THEN
    -- Soma o que o beneficiário já recebeu no mês corrente
    SELECT COALESCE(SUM(mi.quantidade), 0)
      INTO v_total_mes
      FROM movimentacao_item mi
      JOIN movimentacao m ON m.id = mi.movimentacao_id
     WHERE m.tipo              = 'saida'
       AND m.beneficiario_id   = v_beneficiario
       AND YEAR(m.data_movimentacao)  = YEAR(CURRENT_TIMESTAMP)
       AND MONTH(m.data_movimentacao) = MONTH(CURRENT_TIMESTAMP);

    IF (v_total_mes + NEW.quantidade) > 20 THEN
      SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'RN04: Limite mensal de 20 itens por beneficiário atingido.';
    END IF;
  END IF;
END$$

CREATE OR REPLACE VIEW vw_consumo_mensal_beneficiario AS
SELECT
  b.id                          AS beneficiario_id,
  b.nome                        AS beneficiario,
  YEAR(m.data_movimentacao)     AS ano,
  MONTH(m.data_movimentacao)    AS mes,
  SUM(mi.quantidade)            AS total_itens_recebidos,
  (20 - SUM(mi.quantidade))     AS saldo_disponivel
FROM beneficiario b
JOIN movimentacao     m  ON m.beneficiario_id = b.id AND m.tipo = 'saida'
JOIN movimentacao_item mi ON mi.movimentacao_id = m.id
GROUP BY b.id, b.nome, ano, mes;
