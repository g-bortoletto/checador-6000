# Plano de Implementacao das Validacoes DLO 2061

## Objetivo

Evoluir o Checador 6000 de uma validacao exclusivamente XSD para um pipeline local de validacao DLO 2061, capaz de:

- rejeitar falhas de entrada;
- gerar indicios de pos-processamento sem rejeitar o documento;
- aplicar configuracao versionada pela data-base;
- identificar cada resultado por catalogo, ELIM, RGR e fonte regulatoria;
- declarar explicitamente validacoes indisponiveis por ausencia de dados externos.

## Estado inicial

- [x] Arquitetura analisada: o aplicativo executa somente validacao XSD em `src/core/XsdValidator.ts`.
- [x] Catalogo, configuracao CSV e fontes regulatorias mapeados.
- [x] Lacunas identificadas: nao ha parser semantico, motor RGR, versionamento de configuracao, resultados por regra ou testes automatizados.

O XSD continua sendo uma barreira inicial util, mas nao e suficiente para executar as regras descritas em `catalogo-validacoes-pre-pos-processamento.md`.

## Principios Regulatorios

1. Separar estritamente rejeicoes de entrada de indicios de pos-processamento. As criticas de entrada rejeitam automaticamente o documento; as de pos-processamento ocorrem apos a aceitacao e podem produzir indicios. Fonte: `instrucoes-preenchimento/knowledge/07-criticas-validacao.md`, linhas 11-19.
2. Usar os arquivos sob `instrucoes-preenchimento/knowledge/` como fonte regulatoria pesquisavel. Em caso de incerteza ou conflito, verificar o PDF original conforme `AGENTS.md`.
3. Materializar listas, dominios, formulas e mensagens pela `dataBase` do documento. Artefatos expirados nao podem ser aplicados.
4. Preservar a hierarquia de autoridade: PDF fonte, Markdown normalizado, conhecimento estruturado, regras YAML derivadas e implementacao.
5. Nao apresentar ausencia de dependencias externas como aprovacao. O resultado deve informar que a regra foi ignorada e qual fonte esta ausente.

## Divergencia Conhecida do XSD

O XSD atual declara leiaute a partir de 2024-12 e restringe `cnpj` a oito digitos numericos em `validation-schema.xsd`, linhas 59-67. A instrucao de 2026/07 exige oito caracteres numericos ate 2026-06 e alfanumericos a partir de 2026-07. Fonte: `instrucoes-preenchimento/knowledge/03-orientacoes-gerais-arquivo-xml.md`, linha 15.

Para data-base a partir de 2026-07, a regra documental e a configuracao vigente prevalecem. A adequacao deve ser aplicada fora ou em substituicao ao trecho legado do XSD, sem permitir que o XSD invalide um CNPJ documentalmente valido.

## Fase 1: Fundacao do Pipeline

**Progresso: 0%**

### Entregaveis

- [ ] Expandir `src/core/ValidationResultTypes.ts` para resultados normalizados com `id`, `stage`, `outcome`, `severity`, ELIM, RGR, mensagem, linha, XPath e dependencias ausentes.
- [ ] Criar modelo DLO tipado e parser semantico de XML, preservando localizacao dos nos quando disponivel.
- [ ] Manter XSD como primeira barreira e adicionar validacoes documentais que ele nao representa corretamente.
- [ ] Validar bytes, declaracao XML e encoding para `PRE-XML-001`. `File.text()` nao preserva informacao suficiente para garantir o encoding declarado.
- [ ] Aplicar as regras de cabecalho para CNPJ, `dataBase`, `codigoDocumento` e `tipoEnvio`.
- [ ] Atualizar a interface para apresentar sumario, rejeicoes, indicios, regras ignoradas e contexto por ocorrencia.

### Arquivos previstos

- Alterar `src/core/XsdValidator.ts`.
- Alterar `src/core/ValidationResultTypes.ts`.
- Alterar `src/ui/App.tsx`.
- Adicionar `src/core/DloTypes.ts`.
- Adicionar `src/core/DloXmlParser.ts`.
- Adicionar `src/core/ValidationPipeline.ts`.
- Adicionar `src/core/validators/StructuralValidator.ts`.
- Adicionar `src/core/validators/LegacyXsdCompatibilityValidator.ts`.

### Cobertura

- `PRE-XML-001` a `PRE-XML-012`.
- Estrutura, ordem e cardinalidade: `validation-schema.xsd`, linhas 16-29 e 79-163.
- Cabecalho, limites, parametros, contas e instrumentos: secao 3 das instrucoes, paginas 6-13.

### Criterios de aceite

- Um XML pode retornar multiplos diagnosticos estruturados sem interromper a analise na primeira falha.
- Casos de CNPJ para 2026-06 e 2026-07 possuem testes de regressao.
- A interface deixa claro se o resultado e uma rejeicao, indicio ou cobertura indisponivel.

## Fase 2: Configuracao Versionada

**Progresso: 0%**

### Entregaveis

- [ ] Definir formato normalizado e versionado para configuracao por data-base, incluindo metadados de vigencia e origem.
- [ ] Carregar e indexar `limites.csv`, `parametros.csv`, `contas-captacao.csv`, `elementos.csv`, tipos de cliente, participante e razao, `regras.csv` e `elims.csv`.
- [ ] Definir o processo que relaciona cada data-base a uma versao da configuracao. Os CSVs atuais nao possuem colunas de vigencia.
- [ ] Publicar a configuracao como JSON gerado/versionado ou por importacao Vite controlada. Arquivos em `docs/` nao podem ser buscados por `fetch` no build sem publicacao explicita.
- [ ] Criar manifesto de rastreabilidade com `catalogId`, ELIM, RGR, regra YAML relacionada, vigencia, estagio, dependencias e estado de cobertura.

### Arquivos previstos

- Adicionar `src/core/config/ConfigTypes.ts`.
- Adicionar `src/core/config/ConfigLoader.ts`.
- Adicionar `src/core/config/ConfigIndex.ts`.
- Adicionar `src/core/config/CsvParser.ts`.
- Adicionar `src/core/CatalogTraceability.ts`.
- Adicionar artefatos de configuracao normalizada em diretorio versionado.

### Fontes

- `configuracao-dlo-2061/regras.csv`: 3.060 regras RGR e formulas associadas a ELIM.
- `configuracao-dlo-2061/elims.csv`: mensagens e descricoes de ELIM.
- `catalogo-validacoes-pre-pos-processamento.md`, linhas 7-17 e 84-95.

### Criterios de aceite

- Para cada `dataBase`, o pipeline informa a versao de configuracao efetivamente aplicada.
- Todo resultado ELIM inclui a RGR, mensagem e item de catalogo associados quando aplicaveis.
- A ausencia de configuracao vigente impede a execucao e e apresentada como erro operacional claro.

## Fase 3: Regras de Entrada Semanticas

**Progresso: 0%**

### Entregaveis

- [ ] Implementar referencias e dominios: `PRE-REF-001` a `PRE-REF-009`.
- [ ] Implementar estrutura de contas, detalhes, COSIF, clientes e instrumentos: `PRE-EST-001` a `PRE-EST-012`.
- [ ] Implementar precisao, sinal e presenca condicional: `PRE-VAL-001` a `PRE-VAL-010`.
- [ ] Usar `decimal.js` para valores monetarios, tolerancias e comparacoes. Nao usar `number` para calculos regulatorios.
- [ ] Associar falhas as ELIMs prescritas, preservando a mensagem configurada.

### Fontes regulatorias

- Elementos, soma de detalhes e reconciliacao contabil: `instrucoes-preenchimento/knowledge/03-orientacoes-gerais-arquivo-xml.md`, linhas 474-492.
- LEC, LECO e participantes: mesmo arquivo, linhas 516-530.
- Instrumentos de capital: mesmo arquivo, linhas 532-542.
- Catalogo de regras: `catalogo-validacoes-pre-pos-processamento.md`, linhas 38-82.

### Criterios de aceite

- Fixtures invalidas por dominio, unicidade, soma, sinal e detalhe geram rejeicao com ELIM identificavel.
- Regras condicionais baseadas em perfil institucional retornam cobertura indisponivel se o perfil nao for fornecido.
- Nenhuma regra dependente de fonte externa e executada com dados inferidos do XML.

## Fase 4: Motor de Formulas RGR

**Progresso: 0%**

### Entregaveis

- [ ] Implementar lexer, parser e avaliador seguro para a DSL de `regras.csv`. Nao usar `eval`.
- [ ] Suportar inicialmente `SALDO`, `SE`, `ABS`, `MAX`, `IS_CONTA_POSSUI_TAG`, `IS_SALDO_IGUAL_DETALHAMENTOS_CONTA`, `IS_SALDO_IGUAL_DETALHAMENTOS_COSIF`, `IS_ELEMENTO_ASSOCIADO_CONTA` e `IS_ELEMENTO_DOMINIO_ASSOCIADO_CONTA`.
- [ ] Suportar separador `;`, virgula decimal, listas e codigos de conta com ponto.
- [ ] Aplicar tolerancia e arredondamento da formula individual, incluindo `0,15` e `1`.
- [ ] Executar progressivamente regras que dependem somente do documento e configuracao.

### Arquivos previstos

- Adicionar `src/core/rules/FormulaLexer.ts`.
- Adicionar `src/core/rules/FormulaParser.ts`.
- Adicionar `src/core/rules/FormulaEvaluator.ts`.
- Adicionar `src/core/validators/ReferenceValidator.ts`.
- Adicionar `src/core/validators/ParameterizedRuleValidator.ts`.

### Cobertura inicial

- `ELIM0956`, `ELIM0902`, `ELIM0013`, `ELIM0059`, `ELIM0060`, `ELIM0026`, `ELIM0016` e `ELIM2018`.
- Contas geradas, contas totalizadoras e reconciliacoes de entrada descritas em `catalogo-validacoes-pre-pos-processamento.md`, linhas 84-95.

### Criterios de aceite

- Formulas representativas de cada funcao passam em fixtures validas e falham com a ELIM correta em fixtures alteradas.
- Toda RGR nao suportada consta explicitamente no relatorio de cobertura, sem ser ignorada silenciosamente.

## Fase 5: Formulas e Gates Avancados

**Progresso: 0%**

### Entregaveis

- [ ] Expandir a DSL ate cobrir as 3.060 RGRs ou classificar formalmente cada excecao.
- [ ] Implementar composicao de PR, RWA, RA, LCSP, LEC/LECO, LOC, IRRBB, RWAOPAD e RWAMPAD.
- [ ] Executar as 363 formulas de contas geradas.
- [ ] Aplicar gates de segmento, conglomerado, cooperativa, regime, habilitacao e modelos somente com perfil institucional verificavel.

### Fontes e limites

- Catalogo de formulas: `catalogo-validacoes-pre-pos-processamento.md`, linhas 88-95.
- Classificacao institucional, exposicoes, mitigadores, modelos, IRRBB, LCSP, LEC/LECO e LOC possuem dependencias nao dedutiveis exclusivamente do XML. Ver `docs/dlo/rules/review-required.md`, linhas 5-91.

### Criterios de aceite

- Painel de cobertura mostra RGRs implementadas, condicionais, bloqueadas por dependencia e nao suportadas.
- Nenhuma regra de aplicabilidade e inferida na ausencia de dados institucionais comprovaveis.

## Fase 6: Pos-Processamento

**Progresso: 0%**

### Entregaveis

- [ ] Criar executor separado para criticas `DLO` e `LIM`, que nunca transforma indicios em rejeicoes.
- [ ] Executar por padrao as criticas exclusivamente locais: `DLO00001-DLO00007`, `DLO00040`, `DLO00046`, `DLO00058`, `DLO00060-DLO00065`, `DLO00068`, `DLO00076-DLO00079`, `DLO00091`, `DLO00096-DLO00100`, `DLO00129`, `DLO00143`, `DLO00146`, `DLO00150`, `DLO00154` e a parcela local de `DLO00155-DLO00158`.
- [ ] Definir interfaces de provedores para historico DLO, COSIF, DDR, SCR, CADIP, BIS/CCyB, DRO, B3 e cadastro institucional.
- [ ] Marcar regras `H` e `X` como ignoradas, com a dependencia ausente explicita.
- [ ] Aplicar vigencia para manter criticas vencidas apenas em reproducao historica.

### Arquivos previstos

- Adicionar `src/core/postprocessing/PostProcessingValidator.ts`.
- Adicionar `src/core/postprocessing/DependencyProvider.ts`.

### Fontes

- Estados de entrada e qualidade: `instrucoes-preenchimento/knowledge/07-criticas-validacao.md`, linhas 11-19.
- Mapa completo de criticas e dependencias: `catalogo-validacoes-pre-pos-processamento.md`, linhas 97-166.

### Criterios de aceite

- A interface separa documento rejeitado, aceito com indicios, aceito e cobertura indisponivel.
- Ausencia de base externa aparece como limitacao da validacao, nao como aprovacao do documento.

## Fase 7: Qualidade e Governanca

**Progresso: 0%**

### Entregaveis

- [ ] Adicionar Vitest, script `test` e verificacao de `typecheck`, testes e build em CI.
- [ ] Criar fixtures XML minimas, validas e invalidas, por familia de regra.
- [ ] Nao usar `dlo-arquivo-exemplo.xml` como fixture positiva sem curadoria; ele contem dados ilustrativos e inconsistencias deliberadas.
- [ ] Criar testes para parser CSV, vigencia, DSL, arredondamento Decimal, ELIM/RGR e regressao de configuracao.
- [ ] Criar teste de completude do manifesto: cada `PRE-*`, ELIM e critica DLO/LIM deve estar como `implemented`, `partial`, `conditional` ou `blocked`, com justificativa.
- [ ] Documentar atualizacao regulatoria: nova planilha, extracao, diff de configuracao, revisao de vigencia, regressao e aprovacao.

### Criterios de aceite

- Nao ha regressao em regras ja implementadas ao atualizar configuracao ou DSL.
- O relatorio de cobertura e auditavel por catalogo, RGR, ELIM, data-base e dependencia.

## Dependencias Externas

| Dependencia                            | Criticas habilitadas                                                                    |
| -------------------------------------- | --------------------------------------------------------------------------------------- |
| Configuracao versionada por data-base  | Todas as regras de entrada, dominios, sinais, formulas e mensagens ELIM.                |
| Cadastro institucional/Sistema Limites | Escopo, segmento, regime, conglomerado, cooperativa, autorizacoes e limites aplicaveis. |
| Historico de DLOs aceitos              | `DLO00043-DLO00045`, `DLO00125` e `LIM01012`.                                           |
| COSIF e mapeamento DLO-COSIF           | Reconciliacoes de COSIF e a maior parte das criticas de qualidade contabil.             |
| DDR                                    | `DLO00011-DLO00018` e `DLO00145`.                                                       |
| SCR e CADIP                            | Criticas de classificacao, contrapartes e limites por exposicao.                        |
| BIS/CCyB, DRO e B3                     | `DLO00133`, `DLO00161` e `DLO00163`.                                                    |

## Ordem Recomendada

1. Fases 1 e 7: estruturar resultados, compatibilidade regulatoria e testes.
2. Fase 2: disponibilizar configuracao versionada e rastreabilidade.
3. Fase 3: implementar regras de entrada diretamente verificaveis.
4. Fase 4: implementar DSL e reconciliacoes fundamentais.
5. Fase 5: cobrir formulas completas e gates institucionais.
6. Fase 6: habilitar pos-processamento local e, depois, adaptadores externos.

## Definicao de Conclusao

O plano sera considerado concluido quando:

- todas as regras do catalogo tiverem estado de cobertura rastreavel;
- regras de entrada executaveis localmente rejeitarem com identificacao ELIM/RGR;
- criticas de qualidade executaveis localmente produzirem indicios sem rejeitar o XML;
- regras dependentes de fontes externas declararem a dependencia e nao simularem cobertura;
- configuracao, vigencia, formulas e fontes regulatorias puderem ser auditadas para cada resultado.
