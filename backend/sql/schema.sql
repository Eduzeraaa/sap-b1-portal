
CREATE TABLE departamento (
    id              INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome            VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE usuario (
    id              INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    login           VARCHAR(255) NOT NULL UNIQUE,
    senha_hash      VARCHAR(255) NOT NULL,
    cargo           VARCHAR(30) NOT NULL CHECK (cargo IN ('FUNCIONARIO', 'COMPRAS')),
    dept_id         INTEGER REFERENCES departamento(id)
);

CREATE TABLE solicitacoes (
    id              INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    solicitante     INTEGER NOT NULL REFERENCES usuario(id),
    status          VARCHAR NOT NULL,
    criado_em       DATE NOT NULL
);

CREATE TABLE itens_solicitacao (
    id              INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    solicitacao_id  INTEGER NOT NULL REFERENCES solicitacoes(id),
    descricao       VARCHAR(255) NOT NULL,
    quantidade      INTEGER NOT NULL
);
