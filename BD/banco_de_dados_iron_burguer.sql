use iron_burguer;
CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    login VARCHAR(50),
    senha VARCHAR(100),
    tipo VARCHAR(20) -- cliente, funcionario
);

CREATE TABLE cliente (
    id_cliente INT PRIMARY KEY,
    telefone VARCHAR(20),
    FOREIGN KEY (id_cliente) REFERENCES usuario(id_usuario)
);

CREATE TABLE produto (
    id_produto INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    preco DECIMAL(10,2),
    disponivel BOOLEAN
);

CREATE TABLE estoque (
    id_estoque INT AUTO_INCREMENT PRIMARY KEY,
    quantidade INT,
    id_produto INT UNIQUE,
    FOREIGN KEY (id_produto) REFERENCES produto(id_produto)
);

CREATE TABLE status_pedido (
    id_status INT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(50)
);

CREATE TABLE pedido (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    data_hora DATETIME,
    valor_total DECIMAL(10,2),
    id_cliente INT,
    id_status INT,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    FOREIGN KEY (id_status) REFERENCES status_pedido(id_status)
);

ALTER TABLE pedido 
ADD COLUMN numero_pedido VARCHAR(10) UNIQUE;

DELIMITER $$

CREATE TRIGGER gerar_numero_pedido
AFTER INSERT ON pedido
FOR EACH ROW
BEGIN
    UPDATE pedido
    SET numero_pedido = CONCAT('IB', LPAD(NEW.id_pedido, 3, '0'))
    WHERE id_pedido = NEW.id_pedido;
END$$

DELIMITER ;

CREATE TABLE item_pedido (
    id_item INT AUTO_INCREMENT PRIMARY KEY,
    quantidade INT,
    valor DECIMAL(10,2),
    id_pedido INT,
    id_produto INT,
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),
    FOREIGN KEY (id_produto) REFERENCES produto(id_produto)
);

CREATE TABLE pagamento (
    id_pagamento INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(50),
    valor DECIMAL(10,2),
    status VARCHAR(50),
    id_pedido INT UNIQUE,
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido)
);							