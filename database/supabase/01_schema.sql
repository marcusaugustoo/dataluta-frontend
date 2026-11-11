-- =====================================================================
-- DATALUTA - Schema para Supabase (PostgreSQL)
-- Módulos: floresta | agrario (núcleo comum + colunas específicas)
--
-- Como rodar: Supabase Dashboard > SQL Editor > cole este arquivo > Run.
-- Depois rode 02_seed.sql (catálogos).
--
-- Segurança (RLS):
--   * anon/authenticated  -> só LEITURA dos catálogos aprovados.
--   * envio de notícias   -> somente via RPC public.enviar_noticia(modulo, dados),
--                            que grava tudo numa única transação.
--   * revisor/admin       -> usuários do Supabase Auth ligados em usuarios.auth_user_id
--                            leem/revisam notícias e gerenciam catálogos.
-- =====================================================================

begin;

create extension if not exists unaccent with schema extensions;

-- Schema não exposto pela API, para funções internas.
create schema if not exists private;
revoke all on schema private from public, anon;

-- ---------- USUÁRIOS ----------
-- O formulário identifica o cadastrador por nome + e-mail (sem senha).
-- auth_user_id é preenchido para quem tiver login no Supabase Auth (revisores/admins).
create table public.usuarios (
  id            bigint generated always as identity primary key,
  auth_user_id  uuid unique references auth.users (id) on delete set null,
  nome          varchar(100) not null,
  sobrenome     varchar(100) not null,
  email         varchar(255) not null unique check (email = lower(email)),
  papel         varchar(20)  not null default 'cadastrador'
                check (papel in ('admin', 'revisor', 'cadastrador')),
  ativo         boolean      not null default true,
  criado_em     timestamptz  not null default now()
);

-- ---------- CATÁLOGOS ----------
-- modulos: em quais formulários o item aparece ('floresta', 'agrario' ou ambos).
create table public.macrorregioes (
  id                      bigint generated always as identity primary key,
  codigo                  varchar(50)  not null unique,
  rotulo                  varchar(150) not null,
  habilita_campos_local   boolean      not null default false,
  ordem                   smallint     not null default 0
);

create table public.estados (
  id          bigint generated always as identity primary key,
  codigo      varchar(10)  not null unique,      -- sigla (SP, PR...)
  rotulo      varchar(100) not null,
  ibge_code   integer      not null unique,
  regiao      varchar(20)  not null
              check (regiao in ('norte','nordeste','sudeste','sul','centro-oeste'))
);

create table public.acoes_matriz (
  id       bigint generated always as identity primary key,
  codigo   varchar(80)  not null unique,
  rotulo   varchar(200) not null,
  ordem    smallint     not null default 0,
  modulos  text[]       not null default '{floresta,agrario}'
           check (cardinality(modulos) > 0 and modulos <@ array['floresta','agrario']::text[])
);

create table public.acoes_derivadas (
  id              bigint generated always as identity primary key,
  acao_matriz_id  bigint       not null references public.acoes_matriz (id) on delete cascade,
  codigo          varchar(120) not null,
  rotulo          varchar(255) not null,
  ordem           smallint     not null default 0,
  modulos         text[]       not null default '{floresta,agrario}'
                  check (cardinality(modulos) > 0 and modulos <@ array['floresta','agrario']::text[]),
  unique (acao_matriz_id, codigo)
);

create table public.ods (
  id          bigint generated always as identity primary key,
  numero      smallint     not null unique check (numero between 1 and 17),
  codigo      text generated always as ('ods-' || numero::text) stored unique,  -- valor usado no form
  titulo      varchar(200) not null,
  finalidade  text,
  url         varchar(500),
  cor         varchar(20)
);

-- Movimentos e instituições crescem com o uso (entradas "novas" digitadas no form).
-- Entradas novas entram com aprovado = false até um revisor validar.
create table public.movimentos (
  id        bigint generated always as identity primary key,
  codigo    varchar(150) not null unique,
  rotulo    varchar(255) not null unique,
  aprovado  boolean      not null default true,
  ordem     smallint     not null default 0,
  modulos   text[]       not null default '{floresta,agrario}'
            check (cardinality(modulos) > 0 and modulos <@ array['floresta','agrario']::text[])
);

create table public.instituicoes (
  id        bigint generated always as identity primary key,
  codigo    varchar(150) not null unique,
  rotulo    varchar(255) not null unique,
  aprovado  boolean      not null default true,
  ordem     smallint     not null default 0,
  modulos   text[]       not null default '{floresta,agrario}'
            check (cardinality(modulos) > 0 and modulos <@ array['floresta','agrario']::text[])
);

-- Listas simples de opção única/múltipla, separadas por categoria.
create table public.opcoes (
  id         bigint generated always as identity primary key,
  categoria  varchar(40)  not null
             check (categoria in ('escala_acao','bioma','modalidade_acao','modalidade_movimento',
                                  'finalidade','pauta','tipo_movimento','tipo_instituicao')),
  codigo     varchar(150) not null,
  rotulo     varchar(255) not null,
  aprovado   boolean      not null default true,
  ordem      smallint     not null default 0,
  modulos    text[]       not null default '{floresta,agrario}'
             check (cardinality(modulos) > 0 and modulos <@ array['floresta','agrario']::text[]),
  unique (categoria, codigo)
);

-- ---------- NOTÍCIA (tabela central) ----------
create table public.noticias (
  id                bigint generated always as identity primary key,
  codigo_noticia    varchar(50)  not null unique,
  modulo            varchar(10)  not null check (modulo in ('floresta','agrario')),
  usuario_id        bigint       not null references public.usuarios (id),
  status            varchar(15)  not null default 'enviada'
                    check (status in ('rascunho','enviada','revisada','rejeitada')),
  titulo            varchar(500) not null,
  fonte             varchar(500) not null,
  data_publicacao   date         not null,

  -- Local
  macrorregiao_id   bigint references public.macrorregioes (id),
  estado_id         bigint references public.estados (id),
  municipio         varchar(150),
  localidade        varchar(255),                       -- só floresta
  acao_online       varchar(10) check (acao_online in ('sim','nao','hibrido')),

  -- Ação
  acao_matriz_id    bigint references public.acoes_matriz (id),
  acao_derivada_id  bigint references public.acoes_derivadas (id),
  sugestao_acao     text,                               -- só floresta
  data_inicial      date,
  data_final        date,
  data_incompleta   varchar(100),                       -- datas parciais em texto

  -- Pauta
  pauta_especifica  text,

  -- Movimento (textos "outro/novo" ficam guardados como digitados)
  outro_tipo_movimento  varchar(255),
  novo_movimento        varchar(255),
  lupem_oposicao        varchar(3) check (lupem_oposicao in ('sim','nao')),  -- só floresta
  quantidade_pessoas    integer check (quantidade_pessoas  >= 0),
  quantidade_familias   integer check (quantidade_familias >= 0),

  criado_em         timestamptz not null default now(),
  atualizado_em     timestamptz not null default now(),

  check (data_final is null or data_inicial is null or data_final >= data_inicial)
);

-- ---------- LIGAÇÕES N:N ----------
-- escala_acao, bioma, modalidade_acao, modalidade_movimento, finalidade, pauta, tipo_movimento
create table public.noticia_opcoes (
  noticia_id  bigint not null references public.noticias (id) on delete cascade,
  opcao_id    bigint not null references public.opcoes (id),
  primary key (noticia_id, opcao_id)
);

create table public.noticia_movimentos (
  noticia_id    bigint not null references public.noticias (id) on delete cascade,
  movimento_id  bigint not null references public.movimentos (id),
  primary key (noticia_id, movimento_id)
);

create table public.noticia_instituicoes (
  noticia_id      bigint      not null references public.noticias (id) on delete cascade,
  instituicao_id  bigint      not null references public.instituicoes (id),
  papel           varchar(10) not null check (papel in ('aliada','opositora')),
  primary key (noticia_id, instituicao_id, papel)
);

-- Tipos de instituição precisam do papel (aliada/opositora), então têm tabela própria.
create table public.noticia_tipos_instituicao (
  noticia_id  bigint      not null references public.noticias (id) on delete cascade,
  opcao_id    bigint      not null references public.opcoes (id),
  papel       varchar(10) not null check (papel in ('aliada','opositora')),
  primary key (noticia_id, opcao_id, papel)
);

create table public.noticia_ods (
  noticia_id  bigint not null references public.noticias (id) on delete cascade,
  ods_id      bigint not null references public.ods (id),
  primary key (noticia_id, ods_id)
);

-- ---------- ÍNDICES ----------
create index idx_noticias_modulo_data   on public.noticias (modulo, data_publicacao);
create index idx_noticias_estado        on public.noticias (estado_id);
create index idx_noticias_usuario       on public.noticias (usuario_id);
create index idx_noticias_macrorregiao  on public.noticias (macrorregiao_id);
create index idx_noticias_acao_matriz   on public.noticias (acao_matriz_id);
create index idx_noticias_acao_derivada on public.noticias (acao_derivada_id);
create index idx_noticia_opcoes_opcao   on public.noticia_opcoes (opcao_id);
create index idx_noticia_mov_mov        on public.noticia_movimentos (movimento_id);
create index idx_noticia_inst_inst      on public.noticia_instituicoes (instituicao_id);
create index idx_noticia_tipos_opcao    on public.noticia_tipos_instituicao (opcao_id);
create index idx_noticia_ods_ods        on public.noticia_ods (ods_id);

-- =====================================================================
-- FUNÇÕES AUXILIARES (schema private, não expostas pela API)
-- =====================================================================

-- Mesmo algoritmo de src/utils/slugify.ts
create function private.slugify(p text) returns text
language sql stable set search_path = '' as $$
  select trim(both '-' from regexp_replace(lower(extensions.unaccent(coalesce(p, ''))), '[^a-z0-9]+', '-', 'g'))
$$;

-- jsonb array de strings -> text[] (sem vazios/duplicados)
create function private.codigos(p jsonb) returns text[]
language sql immutable set search_path = '' as $$
  select case when jsonb_typeof(p) = 'array' then
    coalesce((select array_agg(distinct x) from jsonb_array_elements_text(p) as x where x <> ''), '{}')
  else '{}'::text[] end
$$;

-- Texto livre "a; b; c" -> {a,b,c}
create function private.itens_texto(p text) returns text[]
language sql immutable set search_path = '' as $$
  select coalesce(array_agg(trim(x)), '{}')
  from unnest(regexp_split_to_array(coalesce(p, ''), ';')) as x
  where trim(x) <> ''
$$;

create function private.is_revisor() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.usuarios u
    where u.auth_user_id = (select auth.uid()) and u.ativo and u.papel in ('admin', 'revisor')
  )
$$;

create function private.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.usuarios u
    where u.auth_user_id = (select auth.uid()) and u.ativo and u.papel = 'admin'
  )
$$;

create function private.set_atualizado_em() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.atualizado_em := now();
  return new;
end $$;

create trigger trg_noticias_atualizado_em
  before update on public.noticias
  for each row execute function private.set_atualizado_em();

-- Vincula opções (por código) a uma notícia; erro se algum código não existir no módulo.
create function private.vincular_opcoes(p_noticia bigint, p_modulo text, p_categoria text, p_codigos text[])
returns void language plpgsql set search_path = '' as $$
declare v_qtd int;
begin
  if cardinality(p_codigos) = 0 then return; end if;
  insert into public.noticia_opcoes (noticia_id, opcao_id)
  select p_noticia, o.id from public.opcoes o
  where o.categoria = p_categoria and o.codigo = any (p_codigos) and p_modulo = any (o.modulos)
  on conflict do nothing;
  get diagnostics v_qtd = row_count;
  if v_qtd < cardinality(p_codigos) then
    raise exception 'Opção inválida em "%": %', p_categoria, p_codigos using errcode = '22023';
  end if;
end $$;

create function private.vincular_tipos_instituicao(p_noticia bigint, p_modulo text, p_papel text, p_codigos text[])
returns void language plpgsql set search_path = '' as $$
declare v_qtd int;
begin
  if cardinality(p_codigos) = 0 then return; end if;
  insert into public.noticia_tipos_instituicao (noticia_id, opcao_id, papel)
  select p_noticia, o.id, p_papel from public.opcoes o
  where o.categoria = 'tipo_instituicao' and o.codigo = any (p_codigos) and p_modulo = any (o.modulos)
  on conflict do nothing;
  get diagnostics v_qtd = row_count;
  if v_qtd < cardinality(p_codigos) then
    raise exception 'Tipo de instituição inválido: %', p_codigos using errcode = '22023';
  end if;
end $$;

create function private.vincular_movimentos(p_noticia bigint, p_modulo text, p_codigos text[])
returns void language plpgsql set search_path = '' as $$
declare v_qtd int;
begin
  if cardinality(p_codigos) = 0 then return; end if;
  insert into public.noticia_movimentos (noticia_id, movimento_id)
  select p_noticia, m.id from public.movimentos m
  where m.codigo = any (p_codigos) and p_modulo = any (m.modulos)
  on conflict do nothing;
  get diagnostics v_qtd = row_count;
  if v_qtd < cardinality(p_codigos) then
    raise exception 'Movimento inválido: %', p_codigos using errcode = '22023';
  end if;
end $$;

create function private.vincular_instituicoes(p_noticia bigint, p_modulo text, p_papel text, p_codigos text[])
returns void language plpgsql set search_path = '' as $$
declare v_qtd int;
begin
  if cardinality(p_codigos) = 0 then return; end if;
  insert into public.noticia_instituicoes (noticia_id, instituicao_id, papel)
  select p_noticia, i.id, p_papel from public.instituicoes i
  where i.codigo = any (p_codigos) and p_modulo = any (i.modulos)
  on conflict do nothing;
  get diagnostics v_qtd = row_count;
  if v_qtd < cardinality(p_codigos) then
    raise exception 'Instituição inválida: %', p_codigos using errcode = '22023';
  end if;
end $$;

create function private.vincular_ods(p_noticia bigint, p_codigos text[])
returns void language plpgsql set search_path = '' as $$
declare v_qtd int;
begin
  if cardinality(p_codigos) = 0 then return; end if;
  insert into public.noticia_ods (noticia_id, ods_id)
  select p_noticia, o.id from public.ods o where o.codigo = any (p_codigos)
  on conflict do nothing;
  get diagnostics v_qtd = row_count;
  if v_qtd < cardinality(p_codigos) then
    raise exception 'ODS inválido: %', p_codigos using errcode = '22023';
  end if;
end $$;

-- Entradas "novas" digitadas no formulário (ficam pendentes de aprovação).
create function private.opcao_pendente(p_categoria text, p_modulo text, p_rotulo text)
returns bigint language plpgsql set search_path = '' as $$
declare v_id bigint; v_codigo text := private.slugify(p_rotulo);
begin
  if v_codigo = '' then return null; end if;
  insert into public.opcoes (categoria, codigo, rotulo, aprovado, modulos)
  values (p_categoria, v_codigo, left(trim(p_rotulo), 255), false, array[p_modulo])
  on conflict do nothing
  returning id into v_id;
  if v_id is null then
    select id into v_id from public.opcoes where categoria = p_categoria and codigo = v_codigo;
  end if;
  return v_id;
end $$;

create function private.movimento_pendente(p_modulo text, p_rotulo text)
returns bigint language plpgsql set search_path = '' as $$
declare v_id bigint; v_codigo text := private.slugify(p_rotulo);
begin
  if v_codigo = '' then return null; end if;
  insert into public.movimentos (codigo, rotulo, aprovado, modulos)
  values (v_codigo, left(trim(p_rotulo), 255), false, array[p_modulo])
  on conflict do nothing
  returning id into v_id;
  if v_id is null then
    select id into v_id from public.movimentos where codigo = v_codigo or rotulo = trim(p_rotulo) limit 1;
  end if;
  return v_id;
end $$;

create function private.instituicao_pendente(p_modulo text, p_rotulo text)
returns bigint language plpgsql set search_path = '' as $$
declare v_id bigint; v_codigo text := private.slugify(p_rotulo);
begin
  if v_codigo = '' then return null; end if;
  insert into public.instituicoes (codigo, rotulo, aprovado, modulos)
  values (v_codigo, left(trim(p_rotulo), 255), false, array[p_modulo])
  on conflict do nothing
  returning id into v_id;
  if v_id is null then
    select id into v_id from public.instituicoes where codigo = v_codigo or rotulo = trim(p_rotulo) limit 1;
  end if;
  return v_id;
end $$;

-- =====================================================================
-- RPC PÚBLICA: envio de notícia
-- Uso no frontend:
--   supabase.rpc('enviar_noticia', { p_modulo: 'floresta' | 'agrario', p_dados: formData })
-- p_dados = objeto NoticiaSubmission / AgrarioSubmission (mesmas chaves dos forms).
-- Retorna { id, codigo_noticia }.
-- =====================================================================
create function public.enviar_noticia(p_modulo text, p_dados jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_login    jsonb := coalesce(p_dados -> 'login', '{}');
  v_noticia  jsonb := coalesce(p_dados -> 'noticia', '{}');
  v_local    jsonb := coalesce(p_dados -> 'local', '{}');
  v_acao     jsonb := coalesce(p_dados -> 'acao', '{}');
  v_pauta    jsonb := coalesce(p_dados -> 'pauta', '{}');
  v_mov      jsonb := coalesce(p_dados -> 'movimento', '{}');
  v_inst     jsonb := coalesce(p_dados -> 'instituicoes', '{}');

  v_email          text := lower(trim(v_login ->> 'email'));
  v_codigo         text := upper(trim(v_login ->> 'codigoNoticia'));
  v_usuario_id     bigint;
  v_usuario_ativo  boolean;
  v_noticia_id     bigint;
  v_macro_id       bigint;
  v_estado_id      bigint;
  v_matriz_id      bigint;
  v_derivada_id    bigint;
  v_papel          text;
  v_txt            text;
  v_id             bigint;
begin
  if p_modulo is null or p_modulo not in ('floresta', 'agrario') then
    raise exception 'Módulo inválido: %', p_modulo using errcode = '22023';
  end if;
  if coalesce(v_email, '') = '' or coalesce(v_codigo, '') = '' then
    raise exception 'E-mail e código da notícia são obrigatórios' using errcode = '22023';
  end if;
  if exists (select 1 from public.noticias where codigo_noticia = v_codigo) then
    raise exception 'Já existe uma notícia com o código %', v_codigo using errcode = '23505';
  end if;

  -- Usuário (identificado pelo e-mail)
  select id, ativo into v_usuario_id, v_usuario_ativo from public.usuarios where email = v_email;
  if v_usuario_id is null then
    insert into public.usuarios (nome, sobrenome, email)
    values (trim(v_login ->> 'nome'), trim(v_login ->> 'sobrenome'), v_email)
    returning id into v_usuario_id;
  elsif not v_usuario_ativo then
    raise exception 'Usuário desativado' using errcode = '42501';
  end if;

  -- Local
  select id into v_macro_id from public.macrorregioes where codigo = v_local ->> 'macrorregiao';
  if v_macro_id is null then
    raise exception 'Macrorregião inválida: %', v_local ->> 'macrorregiao' using errcode = '22023';
  end if;
  if nullif(v_local ->> 'estado', '') is not null then
    select id into v_estado_id from public.estados where codigo = v_local ->> 'estado';
    if v_estado_id is null then
      raise exception 'Estado inválido: %', v_local ->> 'estado' using errcode = '22023';
    end if;
  end if;

  -- Ação
  if nullif(v_acao ->> 'acaoMatriz', '') is not null then
    select id into v_matriz_id from public.acoes_matriz
    where codigo = v_acao ->> 'acaoMatriz' and p_modulo = any (modulos);
    if v_matriz_id is null then
      raise exception 'Ação matriz inválida: %', v_acao ->> 'acaoMatriz' using errcode = '22023';
    end if;
  end if;
  if nullif(v_acao ->> 'acaoDerivada', '') is not null then
    select id into v_derivada_id from public.acoes_derivadas
    where acao_matriz_id = v_matriz_id and codigo = v_acao ->> 'acaoDerivada' and p_modulo = any (modulos);
    if v_derivada_id is null then
      raise exception 'Ação derivada inválida: %', v_acao ->> 'acaoDerivada' using errcode = '22023';
    end if;
  end if;

  insert into public.noticias (
    codigo_noticia, modulo, usuario_id, titulo, fonte, data_publicacao,
    macrorregiao_id, estado_id, municipio, localidade, acao_online,
    acao_matriz_id, acao_derivada_id, sugestao_acao, data_inicial, data_final, data_incompleta,
    pauta_especifica,
    outro_tipo_movimento, novo_movimento, lupem_oposicao, quantidade_pessoas, quantidade_familias
  ) values (
    v_codigo, p_modulo, v_usuario_id,
    trim(v_noticia ->> 'titulo'),
    trim(v_noticia ->> 'fonte'),
    coalesce(nullif(v_noticia ->> 'dataPublicacao', ''), nullif(v_noticia ->> 'dataNoticia', ''))::date,
    v_macro_id, v_estado_id,
    nullif(trim(v_local ->> 'municipio'), ''),
    nullif(trim(v_local ->> 'localidade'), ''),
    coalesce(nullif(v_local ->> 'acaoOnline', ''), nullif(v_local ->> 'acaoVirtual', '')),
    v_matriz_id, v_derivada_id,
    nullif(trim(v_acao ->> 'sugestao'), ''),
    nullif(v_acao ->> 'dataInicial', '')::date,
    nullif(v_acao ->> 'dataFinal', '')::date,
    nullif(trim(v_acao ->> 'dataIncompleta'), ''),
    nullif(trim(v_pauta ->> 'pautaEspecifica'), ''),
    nullif(trim(v_mov ->> 'outroTipo'), ''),
    nullif(trim(v_mov ->> 'novoMovimento'), ''),
    nullif(v_mov ->> 'lupemOposicao', ''),
    nullif(v_mov ->> 'quantidadePessoas', '')::integer,
    nullif(v_mov ->> 'quantidadeFamilias', '')::integer
  )
  returning id into v_noticia_id;

  -- Opções múltiplas (floresta e agrário usam chaves um pouco diferentes)
  perform private.vincular_opcoes(v_noticia_id, p_modulo, 'escala_acao', private.codigos(v_local -> 'escalaAcao'));
  perform private.vincular_opcoes(v_noticia_id, p_modulo, 'bioma', private.codigos(v_local -> 'biomas'));
  perform private.vincular_opcoes(v_noticia_id, p_modulo, 'modalidade_acao', private.codigos(v_acao -> 'modalidades'));
  perform private.vincular_opcoes(v_noticia_id, p_modulo, 'finalidade',
    private.codigos(coalesce(v_acao -> 'finalidades', v_acao -> 'finalidade')));
  perform private.vincular_opcoes(v_noticia_id, p_modulo, 'pauta',
    private.codigos(coalesce(v_pauta -> 'pautasAmplas', v_pauta -> 'pautaAcao')));
  perform private.vincular_opcoes(v_noticia_id, p_modulo, 'tipo_movimento', private.codigos(v_mov -> 'tipos'));
  perform private.vincular_opcoes(v_noticia_id, p_modulo, 'modalidade_movimento',
    private.codigos(v_mov -> 'modalidadeMovimento'));

  -- Movimentos
  perform private.vincular_movimentos(v_noticia_id, p_modulo, private.codigos(v_mov -> 'nomes'));
  foreach v_txt in array private.itens_texto(v_mov ->> 'outroTipo') loop
    v_id := private.opcao_pendente('tipo_movimento', p_modulo, v_txt);
    if v_id is not null then
      insert into public.noticia_opcoes (noticia_id, opcao_id) values (v_noticia_id, v_id) on conflict do nothing;
    end if;
  end loop;
  foreach v_txt in array private.itens_texto(v_mov ->> 'novoMovimento') loop
    v_id := private.movimento_pendente(p_modulo, v_txt);
    if v_id is not null then
      insert into public.noticia_movimentos (noticia_id, movimento_id) values (v_noticia_id, v_id) on conflict do nothing;
    end if;
  end loop;

  -- Instituições (aliada / opositora)
  foreach v_papel in array array['aliada', 'opositora'] loop
    perform private.vincular_tipos_instituicao(v_noticia_id, p_modulo, v_papel,
      private.codigos(v_inst -> v_papel -> 'tipos'));
    perform private.vincular_instituicoes(v_noticia_id, p_modulo, v_papel,
      private.codigos(v_inst -> v_papel -> 'nomes'));

    foreach v_txt in array private.itens_texto(v_inst -> v_papel ->> 'novoTipo') loop
      v_id := private.opcao_pendente('tipo_instituicao', p_modulo, v_txt);
      if v_id is not null then
        insert into public.noticia_tipos_instituicao (noticia_id, opcao_id, papel)
        values (v_noticia_id, v_id, v_papel) on conflict do nothing;
      end if;
    end loop;
    foreach v_txt in array private.itens_texto(v_inst -> v_papel ->> 'novoNome') loop
      v_id := private.instituicao_pendente(p_modulo, v_txt);
      if v_id is not null then
        insert into public.noticia_instituicoes (noticia_id, instituicao_id, papel)
        values (v_noticia_id, v_id, v_papel) on conflict do nothing;
      end if;
    end loop;
  end loop;

  -- ODS
  perform private.vincular_ods(v_noticia_id, private.codigos(p_dados -> 'ods' -> 'objetivos'));

  return jsonb_build_object('id', v_noticia_id, 'codigo_noticia', v_codigo);
end $$;

-- =====================================================================
-- PERMISSÕES
-- =====================================================================
revoke all on all tables    in schema public from anon, authenticated;
revoke all on all functions in schema private from public, anon, authenticated;

-- Catálogos: leitura pública
grant select on public.macrorregioes, public.estados, public.acoes_matriz, public.acoes_derivadas,
                public.ods, public.movimentos, public.instituicoes, public.opcoes
  to anon, authenticated;

-- Usuários logados (revisores/admins): o RLS abaixo decide o que podem fazer
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage on all sequences in schema public to authenticated;

grant usage on schema private to authenticated;
grant execute on function private.is_revisor() to authenticated;
grant execute on function private.is_admin()   to authenticated;

revoke all on function public.enviar_noticia(text, jsonb) from public, anon, authenticated;
grant execute on function public.enviar_noticia(text, jsonb) to anon, authenticated;

create or replace function public.listar_historico_noticias(
  p_modulo text default null,
  p_email  text default null
)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id',              n.id,
        'codigo_noticia',  n.codigo_noticia,
        'modulo',          n.modulo,
        'status',          n.status,
        'titulo',          n.titulo,
        'fonte',           n.fonte,
        'data_publicacao', n.data_publicacao,
        'municipio',       n.municipio,
        'estado',          e.codigo,
        'criado_em',       n.criado_em,
        'usuario_nome',    trim(u.nome || ' ' || u.sobrenome),
        'usuario_email',   u.email
      )
      order by n.criado_em desc, n.id desc
    ),
    '[]'::jsonb
  )
  from public.noticias n
  join public.usuarios u on u.id = n.usuario_id
  left join public.estados e on e.id = n.estado_id
  where (p_modulo is null or p_modulo = '' or n.modulo = p_modulo)
    and (p_email  is null or trim(p_email) = '' or u.email ilike '%' || trim(p_email) || '%');
$$;

revoke all on function public.listar_historico_noticias(text, text) from public, anon, authenticated;
grant execute on function public.listar_historico_noticias(text, text) to anon, authenticated;

-- =====================================================================
-- RLS
-- =====================================================================
alter table public.usuarios                  enable row level security;
alter table public.macrorregioes             enable row level security;
alter table public.estados                   enable row level security;
alter table public.acoes_matriz              enable row level security;
alter table public.acoes_derivadas           enable row level security;
alter table public.ods                       enable row level security;
alter table public.movimentos                enable row level security;
alter table public.instituicoes              enable row level security;
alter table public.opcoes                    enable row level security;
alter table public.noticias                  enable row level security;
alter table public.noticia_opcoes            enable row level security;
alter table public.noticia_movimentos        enable row level security;
alter table public.noticia_instituicoes      enable row level security;
alter table public.noticia_tipos_instituicao enable row level security;
alter table public.noticia_ods               enable row level security;

-- Catálogos fixos: todos leem; revisores editam
create policy "leitura publica" on public.macrorregioes   for select to anon, authenticated using (true);
create policy "leitura publica" on public.estados         for select to anon, authenticated using (true);
create policy "leitura publica" on public.acoes_matriz    for select to anon, authenticated using (true);
create policy "leitura publica" on public.acoes_derivadas for select to anon, authenticated using (true);
create policy "leitura publica" on public.ods             for select to anon, authenticated using (true);

-- Catálogos que crescem: públicos só os aprovados; revisores veem tudo
create policy "leitura aprovados" on public.movimentos   for select to anon, authenticated using (aprovado);
create policy "leitura aprovados" on public.instituicoes for select to anon, authenticated using (aprovado);
create policy "leitura aprovados" on public.opcoes       for select to anon, authenticated using (aprovado);

create policy "revisor gerencia" on public.macrorregioes   for all to authenticated
  using ((select private.is_revisor())) with check ((select private.is_revisor()));
create policy "revisor gerencia" on public.estados         for all to authenticated
  using ((select private.is_revisor())) with check ((select private.is_revisor()));
create policy "revisor gerencia" on public.acoes_matriz    for all to authenticated
  using ((select private.is_revisor())) with check ((select private.is_revisor()));
create policy "revisor gerencia" on public.acoes_derivadas for all to authenticated
  using ((select private.is_revisor())) with check ((select private.is_revisor()));
create policy "revisor gerencia" on public.ods             for all to authenticated
  using ((select private.is_revisor())) with check ((select private.is_revisor()));
create policy "revisor gerencia" on public.movimentos      for all to authenticated
  using ((select private.is_revisor())) with check ((select private.is_revisor()));
create policy "revisor gerencia" on public.instituicoes    for all to authenticated
  using ((select private.is_revisor())) with check ((select private.is_revisor()));
create policy "revisor gerencia" on public.opcoes          for all to authenticated
  using ((select private.is_revisor())) with check ((select private.is_revisor()));

-- Usuários: cada um vê o próprio registro; revisores veem todos; só admin altera
create policy "ver proprio ou revisor" on public.usuarios for select to authenticated
  using (auth_user_id = (select auth.uid()) or (select private.is_revisor()));
create policy "admin gerencia" on public.usuarios for all to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));

-- Notícias e ligações: só revisores/admins (envio é pela RPC)
create policy "revisor gerencia" on public.noticias                  for all to authenticated
  using ((select private.is_revisor())) with check ((select private.is_revisor()));
create policy "revisor gerencia" on public.noticia_opcoes            for all to authenticated
  using ((select private.is_revisor())) with check ((select private.is_revisor()));
create policy "revisor gerencia" on public.noticia_movimentos        for all to authenticated
  using ((select private.is_revisor())) with check ((select private.is_revisor()));
create policy "revisor gerencia" on public.noticia_instituicoes      for all to authenticated
  using ((select private.is_revisor())) with check ((select private.is_revisor()));
create policy "revisor gerencia" on public.noticia_tipos_instituicao for all to authenticated
  using ((select private.is_revisor())) with check ((select private.is_revisor()));
create policy "revisor gerencia" on public.noticia_ods               for all to authenticated
  using ((select private.is_revisor())) with check ((select private.is_revisor()));

commit;

