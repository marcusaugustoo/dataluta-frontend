-- =====================================================================
-- DATALUTA - Schema relacional (PostgreSQL; SQL portátil)
-- Módulos: floresta | agrario (núcleo comum + colunas específicas)
-- =====================================================================

-- ---------- USUÁRIOS ----------
-- Se usar Supabase Auth, ligue usuarios.id ao auth.users(id).
CREATE TABLE usuarios (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome          VARCHAR(100) NOT NULL,
  sobrenome     VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  papel         VARCHAR(20)  NOT NULL DEFAULT 'cadastrador'
                CHECK (papel IN ('admin', 'revisor', 'cadastrador')),
  ativo         BOOLEAN      NOT NULL DEFAULT TRUE,
  criado_em     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ---------- CATÁLOGOS ----------
CREATE TABLE macrorregioes (
  id                      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  codigo                  VARCHAR(50)  NOT NULL UNIQUE,
  rotulo                  VARCHAR(150) NOT NULL,
  habilita_campos_local   BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE TABLE estados (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  codigo      VARCHAR(10)  NOT NULL UNIQUE,      -- sigla (SP, PR...)
  rotulo      VARCHAR(100) NOT NULL,
  ibge_code   INTEGER      NOT NULL UNIQUE,
  regiao      VARCHAR(20)  NOT NULL
              CHECK (regiao IN ('norte','nordeste','sudeste','sul','centro-oeste'))
);

CREATE TABLE acoes_matriz (
  id      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  codigo  VARCHAR(50)  NOT NULL UNIQUE,
  rotulo  VARCHAR(200) NOT NULL
);

CREATE TABLE acoes_derivadas (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  acao_matriz_id  BIGINT NOT NULL REFERENCES acoes_matriz(id),
  codigo          VARCHAR(50)  NOT NULL,
  rotulo          VARCHAR(200) NOT NULL,
  UNIQUE (acao_matriz_id, codigo)
);

CREATE TABLE ods (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  numero      SMALLINT     NOT NULL UNIQUE CHECK (numero BETWEEN 1 AND 17),
  titulo      VARCHAR(200) NOT NULL,
  finalidade  TEXT,
  url         VARCHAR(500),
  cor         VARCHAR(20)
);

-- Movimentos e instituições crescem com o uso (entradas "novas").
-- aprovado = FALSE até um revisor validar.
CREATE TABLE movimentos (
  id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome      VARCHAR(255) NOT NULL UNIQUE,
  aprovado  BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE TABLE instituicoes (
  id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome      VARCHAR(255) NOT NULL UNIQUE,
  aprovado  BOOLEAN      NOT NULL DEFAULT TRUE
);

-- Listas simples de opção única/múltipla, separadas por categoria:
-- bioma | escala_acao | modalidade_acao | modalidade_movimento |
-- finalidade | pauta_ampla | tipo_movimento | tipo_instituicao
CREATE TABLE opcoes (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  categoria  VARCHAR(40)  NOT NULL,
  codigo     VARCHAR(80)  NOT NULL,
  rotulo     VARCHAR(255) NOT NULL,
  aprovado   BOOLEAN      NOT NULL DEFAULT TRUE,
  UNIQUE (categoria, codigo)
);

-- ---------- NOTÍCIA (tabela central) ----------
CREATE TABLE noticias (
  id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  codigo_noticia    VARCHAR(50)  NOT NULL UNIQUE,
  modulo            VARCHAR(10)  NOT NULL CHECK (modulo IN ('floresta','agrario')),
  usuario_id        BIGINT       NOT NULL REFERENCES usuarios(id),
  status            VARCHAR(15)  NOT NULL DEFAULT 'enviada'
                    CHECK (status IN ('rascunho','enviada','revisada','rejeitada')),
  titulo            VARCHAR(500) NOT NULL,
  fonte             VARCHAR(500) NOT NULL,
  data_publicacao   DATE         NOT NULL,

  -- Local
  macrorregiao_id   BIGINT REFERENCES macrorregioes(id),
  estado_id         BIGINT REFERENCES estados(id),
  municipio         VARCHAR(150),
  localidade        VARCHAR(255),                       -- só floresta
  acao_online       VARCHAR(10) CHECK (acao_online IN ('sim','nao','hibrido')),

  -- Ação
  acao_matriz_id    BIGINT REFERENCES acoes_matriz(id),
  acao_derivada_id  BIGINT REFERENCES acoes_derivadas(id),
  sugestao_acao     TEXT,                               -- só floresta
  data_inicial      DATE,
  data_final        DATE,
  data_incompleta   VARCHAR(100),                       -- datas parciais em texto

  -- Pauta
  pauta_especifica  TEXT,

  -- Movimento
  outro_tipo_movimento  VARCHAR(255),
  novo_movimento        VARCHAR(255),
  lupem_oposicao        VARCHAR(3) CHECK (lupem_oposicao IN ('sim','nao')),  -- só floresta
  quantidade_pessoas    INTEGER CHECK (quantidade_pessoas  >= 0),
  quantidade_familias   INTEGER CHECK (quantidade_familias >= 0),

  criado_em         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CHECK (data_final IS NULL OR data_inicial IS NULL OR data_final >= data_inicial)
);

-- ---------- LIGAÇÕES N:N ----------
CREATE TABLE noticia_opcoes (
  noticia_id  BIGINT NOT NULL REFERENCES noticias(id) ON DELETE CASCADE,
  opcao_id    BIGINT NOT NULL REFERENCES opcoes(id),
  PRIMARY KEY (noticia_id, opcao_id)
);

CREATE TABLE noticia_movimentos (
  noticia_id    BIGINT NOT NULL REFERENCES noticias(id) ON DELETE CASCADE,
  movimento_id  BIGINT NOT NULL REFERENCES movimentos(id),
  PRIMARY KEY (noticia_id, movimento_id)
);

CREATE TABLE noticia_instituicoes (
  noticia_id      BIGINT      NOT NULL REFERENCES noticias(id) ON DELETE CASCADE,
  instituicao_id  BIGINT      NOT NULL REFERENCES instituicoes(id),
  papel           VARCHAR(10) NOT NULL CHECK (papel IN ('aliada','opositora')),
  PRIMARY KEY (noticia_id, instituicao_id, papel)
);

-- Tipos de instituição (aliada/opositora) ficam em noticia_opcoes? Não:
-- precisam do papel, então têm tabela própria.
CREATE TABLE noticia_tipos_instituicao (
  noticia_id  BIGINT      NOT NULL REFERENCES noticias(id) ON DELETE CASCADE,
  opcao_id    BIGINT      NOT NULL REFERENCES opcoes(id),
  papel       VARCHAR(10) NOT NULL CHECK (papel IN ('aliada','opositora')),
  PRIMARY KEY (noticia_id, opcao_id, papel)
);

-- Textos "novo tipo/nome" digitados nas instituições
CREATE TABLE noticia_instituicoes_novas (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  noticia_id  BIGINT       NOT NULL REFERENCES noticias(id) ON DELETE CASCADE,
  papel       VARCHAR(10)  NOT NULL CHECK (papel IN ('aliada','opositora')),
  novo_tipo   VARCHAR(255),
  novo_nome   VARCHAR(255)
);

CREATE TABLE noticia_ods (
  noticia_id  BIGINT NOT NULL REFERENCES noticias(id) ON DELETE CASCADE,
  ods_id      BIGINT NOT NULL REFERENCES ods(id),
  PRIMARY KEY (noticia_id, ods_id)
);

-- ---------- ÍNDICES ----------
CREATE INDEX idx_noticias_modulo_data ON noticias (modulo, data_publicacao);
CREATE INDEX idx_noticias_estado      ON noticias (estado_id);
CREATE INDEX idx_noticias_usuario     ON noticias (usuario_id);
CREATE INDEX idx_noticias_acao        ON noticias (acao_matriz_id, acao_derivada_id);
CREATE INDEX idx_noticia_opcoes_opcao ON noticia_opcoes (opcao_id);
CREATE INDEX idx_noticia_mov_mov      ON noticia_movimentos (movimento_id);
CREATE INDEX idx_noticia_inst_inst    ON noticia_instituicoes (instituicao_id);
CREATE INDEX idx_noticia_ods_ods      ON noticia_ods (ods_id);
