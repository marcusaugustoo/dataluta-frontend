// Gera database/supabase/02_seed.sql a partir dos dados do frontend
// (src/floresta/data/florestaData.ts e src/agrario/data/agrarioData.ts),
// garantindo que os códigos no banco sejam os mesmos slugs usados nos formulários.
//
// Uso: node database/supabase/gerar-seed.mjs
import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..', '..')

const server = await createServer({
  root,
  configFile: false,
  logLevel: 'error',
  server: { middlewareMode: true, hmr: false, watch: null },
  appType: 'custom',
})

const floresta = (await server.ssrLoadModule('/src/floresta/data/florestaData.ts')).options
const agrario = (await server.ssrLoadModule('/src/agrario/data/agrarioData.ts')).options
await server.close()

const q = (v) => (v === null || v === undefined ? 'null' : `'${String(v).replace(/'/g, "''")}'`)
const arr = (mods) => `'{${mods.join(',')}}'`

/** Une listas dos dois módulos por código, registrando em quais módulos cada item aparece. */
function merge(lists) {
  const map = new Map()
  for (const [modulo, items] of lists) {
    for (const item of items ?? []) {
      const existing = map.get(item.value)
      if (existing) {
        if (existing.label !== item.label) {
          console.warn(`Aviso: código "${item.value}" com rótulos diferentes: "${existing.label}" / "${item.label}"`)
        }
        if (!existing.modulos.includes(modulo)) existing.modulos.push(modulo)
      } else {
        map.set(item.value, { ...item, modulos: [modulo] })
      }
    }
  }
  return [...map.values()].map((item, i) => ({ ...item, ordem: i + 1 }))
}

const out = []
out.push('-- =====================================================================')
out.push('-- DATALUTA - Dados iniciais (catálogos)')
out.push('-- ARQUIVO GERADO por database/supabase/gerar-seed.mjs — não edite à mão.')
out.push('-- Rode DEPOIS de 01_schema.sql. Pode ser executado mais de uma vez.')
out.push('-- =====================================================================')
out.push('')
out.push('begin;')
out.push('')

// Macrorregiões
out.push('insert into public.macrorregioes (codigo, rotulo, habilita_campos_local, ordem) values')
out.push(
  floresta.macrorregioes
    .map((m, i) => `  (${q(m.value)}, ${q(m.label)}, ${m.enablesLocationFields}, ${i + 1})`)
    .join(',\n') + '\non conflict (codigo) do nothing;\n',
)

// Estados
out.push('insert into public.estados (codigo, rotulo, ibge_code, regiao) values')
out.push(
  floresta.estados
    .map((e) => `  (${q(e.value)}, ${q(e.label)}, ${e.ibgeCode}, ${q(e.regiao)})`)
    .join(',\n') + '\non conflict (codigo) do nothing;\n',
)

// ODS
out.push('insert into public.ods (numero, titulo, finalidade, url, cor) values')
out.push(
  floresta.ods
    .map((o) => `  (${o.number}, ${q(o.title)}, ${q(o.finalidade)}, ${q(o.url)}, ${q(o.color)})`)
    .join(',\n') + '\non conflict (numero) do nothing;\n',
)

// Ações matriz
const matrizes = merge([
  ['floresta', floresta.acoesMatriz],
  ['agrario', agrario.acoesMatriz],
])
out.push('insert into public.acoes_matriz (codigo, rotulo, ordem, modulos) values')
out.push(
  matrizes.map((m) => `  (${q(m.value)}, ${q(m.label)}, ${m.ordem}, ${arr(m.modulos)})`).join(',\n') +
    '\non conflict (codigo) do nothing;\n',
)

// Ações derivadas
const derivadasRows = []
for (const matriz of matrizes) {
  const flo = floresta.acoesMatriz.find((m) => m.value === matriz.value)?.derivadas
  const agr = agrario.acoesMatriz.find((m) => m.value === matriz.value)?.derivadas
  for (const d of merge([
    ['floresta', flo],
    ['agrario', agr],
  ])) {
    derivadasRows.push(`  (${q(matriz.value)}, ${q(d.value)}, ${q(d.label)}, ${d.ordem}, ${arr(d.modulos)})`)
  }
}
out.push('insert into public.acoes_derivadas (acao_matriz_id, codigo, rotulo, ordem, modulos)')
out.push('select m.id, v.codigo, v.rotulo, v.ordem, v.modulos::text[]')
out.push('from (values')
out.push(derivadasRows.join(',\n'))
out.push(') as v (matriz, codigo, rotulo, ordem, modulos)')
out.push('join public.acoes_matriz m on m.codigo = v.matriz')
out.push('on conflict (acao_matriz_id, codigo) do nothing;\n')

// Opções simples, por categoria
const categorias = {
  escala_acao: [floresta.escalaAcao, agrario.escalaAcao],
  bioma: [floresta.biomas, []],
  modalidade_acao: [floresta.modalidades, []],
  modalidade_movimento: [[], agrario.modalidadeMovimento],
  finalidade: [floresta.finalidades, agrario.finalidades],
  pauta: [floresta.pautasAmplas, agrario.pautasAcao],
  tipo_movimento: [floresta.tiposMovimento, agrario.tiposMovimento],
  tipo_instituicao: [floresta.tiposInstituicao, agrario.tiposInstituicao],
}
const opcoesRows = []
for (const [categoria, [flo, agr]] of Object.entries(categorias)) {
  for (const o of merge([
    ['floresta', flo],
    ['agrario', agr],
  ])) {
    opcoesRows.push(`  (${q(categoria)}, ${q(o.value)}, ${q(o.label)}, ${o.ordem}, ${arr(o.modulos)})`)
  }
}
out.push('insert into public.opcoes (categoria, codigo, rotulo, ordem, modulos) values')
out.push(opcoesRows.join(',\n') + '\non conflict (categoria, codigo) do nothing;\n')

// Movimentos e instituições
for (const [tabela, flo, agr] of [
  ['movimentos', floresta.nomesMovimento, agrario.nomesMovimento],
  ['instituicoes', floresta.nomesInstituicao, agrario.nomesInstituicao],
]) {
  const rows = merge([
    ['floresta', flo],
    ['agrario', agr],
  ])
  out.push(`insert into public.${tabela} (codigo, rotulo, ordem, modulos) values`)
  out.push(
    rows.map((r) => `  (${q(r.value)}, ${q(r.label)}, ${r.ordem}, ${arr(r.modulos)})`).join(',\n') +
      '\non conflict do nothing;\n',
  )
}

out.push('commit;')
out.push('')

const target = resolve(here, '02_seed.sql')
writeFileSync(target, out.join('\n'), 'utf8')
console.log(`Gerado: ${target}`)

