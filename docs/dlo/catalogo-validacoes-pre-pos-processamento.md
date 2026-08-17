# Catalogo de Validacoes DLO 2061

## Escopo e criterio

Este catalogo relaciona as validacoes que podem ser implementadas com os artefatos presentes no repositorio para o documento DLO 2061. Ele separa validacoes de entrada (que devem rejeitar o XML antes da carga) das criticas de pos-processamento (que produzem indicios apos a carga).

`D` significa que a verificacao usa somente o documento submetido e a configuracao versionada. `H` exige documento(s) DLO anterior(es). `X` exige uma base externa ou cadastro corrente. Uma regra `D` tambem pode usar o perfil cadastrado da instituicao, se esse perfil for fornecido ao validador.

Os artefatos de configuracao sao a fonte operacional mais detalhada: `configuracao-dlo-2061/regras.csv` contem 3.060 regras (`RGR02882` a `RGR07645`) e `elims.csv` contem suas mensagens. A planilha vigente e `planilha-de-configuracao.xlsx`, cuja data inicial e 2026-07. As listas e formulas abaixo devem ser materializadas pela data-base do documento; codigos, contas, dominios e formulas expirados nao devem ser aplicados.

Fontes principais:

- `instrucoes-preenchimento/knowledge/03-orientacoes-gerais-arquivo-xml.md`, especialmente os itens de XML, detalhes, COSIF, clientes e instrumentos.
- `instrucoes-preenchimento/knowledge/07-criticas-validacao.md`, para a separacao entre entrada e pos-processamento.
- `validation-schema.xsd` e `leiaute-dlo.xlsx`, para estrutura e formato XML.
- `planilha-de-configuracao.xlsx` e `configuracao-dlo-2061/*.csv`, para regras parametrizadas de entrada.
- `criticas-de-pos-processamento.xlsx`, `Sheet0`, para as criticas DLO e LIM de qualidade.

## Validacoes de entrada

### Arquivo XML e leiaute

| ID sugerido | Validacao                                                                                                                                                                                | Dados |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| PRE-XML-001 | Declaracao XML na primeira linha, com versao e encoding permitidos pelo leiaute: `ISO-8859-1`, `EBCDIC-CP-US`, `UTF-8`, `UTF-16` ou `US-ASCII`.                                          | D     |
| PRE-XML-002 | Documento bem formado, sem tags/atributos desconhecidos, obedecendo a sequencia `limitesInformados`, `parametros`, `contas`, `instrumentosCapital`.                                      | D     |
| PRE-XML-003 | Existencia unica das secoes obrigatorias `limitesInformados`, `parametros` e `contas`; `instrumentosCapital` e opcional e, se presente, ocorre uma vez.                                  | D     |
| PRE-XML-004 | Atributos obrigatorios da raiz: `cnpj`, `dataBase`, `codigoDocumento` e `tipoEnvio`; `codigoConglomerado` e opcional.                                                                    | D     |
| PRE-XML-005 | `dataBase` e ano-mes valido, entre `2008-07` inclusive e `2050-01` exclusivo, e usa o separador `-`.                                                                                     | D     |
| PRE-XML-006 | `codigoDocumento` tem quatro digitos e e exatamente `2061`.                                                                                                                              | D     |
| PRE-XML-007 | `tipoEnvio` pertence a `I`, `D` ou `E`.                                                                                                                                                  | D     |
| PRE-XML-008 | `cnpj` e `codigoConglomerado` respeitam formato, tamanho e regra de vigencia do leiaute. Para 2026-07 em diante, complementar o XSD legado com a regra documental de CNPJ alfanumerico.  | D/X   |
| PRE-XML-009 | Ha no minimo dois limites, um parametro e uma conta; listas vazias de detalhes e de instrumentos nao sao aceitas quando suas tags sao abertas.                                           | D     |
| PRE-XML-010 | Unicidade de `codigoLimite`, `codigoParametro`, `codigoConta`, `codigoElemento` dentro de cada detalhe, `codigoCosif` dentro de cada conta, participante dentro do cliente e `idTitulo`. | D     |
| PRE-XML-011 | Formatos, tamanhos, obrigatoriedade e caracteres proibidos de todos os atributos de limite, parametro, conta, detalhe, COSIF, cliente, participante e instrumento seguem o XSD.          | D     |
| PRE-XML-012 | Valores monetarios aceitam no maximo 14 digitos inteiros, sinal opcional e no maximo duas casas; valores de elementos seguem seu formato configurado.                                    | D     |

### Codigos, dominios e vigencia

| ID/ELIM                         | Validacao                                                                                                                                                                                                                                                                                                                                         | Dados |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| PRE-REF-001 / ELIM0950          | Todo `codigoLimite` existe e esta vigente na data-base; `enviado` e `S` ou `N`.                                                                                                                                                                                                                                                                   | D     |
| PRE-REF-002 / ELIM0007          | Todo parametro e seu valor pertencem ao dominio do parametro, vigente na data-base.                                                                                                                                                                                                                                                               | D     |
| PRE-REF-003 / ELIM0009          | Toda conta DLO existe, pertence ao documento 2061 e esta vigente na data-base.                                                                                                                                                                                                                                                                    | D     |
| PRE-REF-004 / ELIM0951          | Todo `codigoCosif` existe e esta vigente; opcionalmente consultar o plano COSIF oficial para validar existencia atual.                                                                                                                                                                                                                            | D/X   |
| PRE-REF-005 / ELIM0059          | O conjunto de elementos de cada conta contem todos os obrigatorios, nao contem elementos nao associados e permite somente os opcionais configurados.                                                                                                                                                                                              | D     |
| PRE-REF-006 / ELIM0060          | O valor de cada elemento pertence ao dominio permitido para aquela combinacao conta-elemento e data-base.                                                                                                                                                                                                                                         | D     |
| PRE-REF-007                     | Validar todos os dominios de tabelas: percentuais de capital, tipo de elemento, subconta RWACPAD, FPR, mitigador, FCC/FEPF, jurisdicao, pais, inclusao no limite, registradora, abordagem, segmento, tipo/carteira/origem de exposicao, tipo de cliente/participante/razao, IRRBB, moeda, derivativos, instrumento de capital, IRB, PD e formula. | D     |
| PRE-REF-008 / ELIM0952-ELIM0954 | `tipoCliente`, `tipoParticipante` e `razaoParticipante` pertencem aos respectivos dominios.                                                                                                                                                                                                                                                       | D     |
| PRE-REF-009                     | Os codigos de parametro obrigatorios e condicionais para a instituicao existem uma unica vez; validar em especial 4, 5, 6, 7, 8, 11, 22, 25 e dados de contato 31, 32 e 33.                                                                                                                                                                       | D/X   |

### Estrutura de contas, detalhes e identificacao

| ID/ELIM                | Validacao                                                                                                                                                                              | Dados |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | --- |
| PRE-EST-001 / ELIM0956 | Contas configuradas para detalhamento DLO possuem `detalhamentosDLO`; cada detalhe possui ao menos um elemento.                                                                        | D     |
| PRE-EST-002 / ELIM0013 | Soma de `valorDetalhe` e igual a `valorConta`, inclusive no detalhe unico.                                                                                                             | D     |
| PRE-EST-003 / ELIM0902 | Soma de `saldoCosif` e igual a `valorCosif`.                                                                                                                                           | D     |
| PRE-EST-004            | Quando a configuracao exigir COSIF para PR, RWACPAD ou RWAOPAD, exigir `detalhamentosCosif`, `codigoCosif` no maior desmembramento e `saldoCosif`; redutores devem ser negativos.      | D     |
| PRE-EST-005            | Quando elemento 2 represente exposicao ou registro contabil, exigir detalhe que permita reconciliacao contabil.                                                                        | D     |
| PRE-EST-006 / ELIM0957 | Contas LEC/LECO de `200.01` a `200.60` possuem cliente quando configurado.                                                                                                             | D     |
| PRE-EST-007 / ELIM0958 | Cliente de grupo de contrapartes conectadas possui ao menos um participante e o detalhamento somente e usado para o tipo de cliente aplicavel.                                         | D     |
| PRE-EST-008 / ELIM0959 | Identificacao de cliente CPF/CNPJ tem formato valido quando o tipo exigir identificador nacional.                                                                                      | D     |
| PRE-EST-009 / ELIM0960 | Identificacao de participante CPF/CNPJ tem formato valido quando o tipo exigir identificador nacional.                                                                                 | D     |
| PRE-EST-010            | `identificacaoCliente`, `nomeCliente`, identificacao de participante e `idTitulo` sao nao vazios, tem no maximo 40/20 caracteres conforme aplicavel e nao contem quebra de linha nem ` | `.    | D   |
| PRE-EST-011            | Cada instrumento de capital possui todos os nove atributos obrigatorios, contas DLO/COSIF validas, registradora, local do emissor e tipo de clausula validos.                          | D     |
| PRE-EST-012            | Contas que exigem instrumentos (`111.08`, `112.01`, `120.01.01`, `120.01.03.01`) possuem os respectivos detalhes de instrumento.                                                       | D     |

### Sinal, precisao e presenca condicional

| ID/ELIM                                     | Validacao                                                                                                                                | Dados |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| PRE-VAL-001 / ELIM0012                      | Elementos definidos como inteiros nao possuem decimal nem formato inteiro invalido.                                                      | D     |
| PRE-VAL-002 / ELIM0961                      | Elementos configurados como `decimal_17_2` tem escala maxima dois.                                                                       | D     |
| PRE-VAL-003 / ELIM0962                      | Elementos configurados como `decimal_17_4` tem escala maxima quatro; aplicar a excecao configurada para sentinela `9999`.                | D     |
| PRE-VAL-004 / ELIM0026                      | Contas e elementos assinalados como positivos sao maiores ou iguais a zero, conforme a formula individual.                               | D     |
| PRE-VAL-005 / ELIM0046 e ELIM0062           | Contas/elementos redutores prescritos sao negativos ou nulos, em especial elemento 46.                                                   | D     |
| PRE-VAL-006 / ELIM0061                      | Elementos configurados como estritamente positivos sao maiores que zero.                                                                 | D     |
| PRE-VAL-007 / ELIM0346 e ELIM0526           | Elemento 2 do RWACPAD e de contas fora de balanco obedece ao sinal especifico da conta/tipo.                                             | D     |
| PRE-VAL-008 / ELIM0042, ELIM0043 e ELIM0049 | Nome, telefone e email do responsavel (parametros 31, 32 e 33) estao preenchidos e no formato valido quando exigidos.                    | D     |
| PRE-VAL-009 / ELIM0027                      | Parametro 11 de fusao/cisao/incorporacao usa somente `S` ou `N`.                                                                         | D     |
| PRE-VAL-010 / ELIM0101, ELIM2004-ELIM2011   | Limites marcados como aplicaveis, parametros de metodologia e declaracoes condicionais sao enviados para o perfil/regime da instituicao. | D/X   |

### Reconciliacoes e formulas de entrada

As formulas devem ser interpretadas diretamente de `regras.csv` e das colunas de validacao de `Conta de Captacao`. Tolerancia, arredondamento e aplicabilidade devem respeitar a formula individual, em especial tolerancias de `0,15` e `1` encontradas na configuracao.

| Familia/ELIM                                                                                                                                                                   | Validacao implementavel                                                                                                                                                                                | Dados |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----- |
| ELIM0016 e ELIM2018                                                                                                                                                            | Recalcular contas totalizadoras a partir de seus componentes e rejeitar diferenca acima da tolerancia. Cobre composicao de PR, RWA, RA, LCSP, LEC/LECO, LOC, IRRBB, RWAOPAD, RWAMPAD e contas geradas. | D     |
| ELIM0201, 0205, 0223, 0227-0228, 0246, 0248, 0252, 0254-0255, 0282-0286, 0298, 0301, 0313-0328, 0331-0344, 0393, 0445-0446, 0450, 0478, 0480, 0565, 0583, 0597-0615, 0617-0621 | Calcular composicao do PR, deducoes, capital requerido, margens, imobilizacao e limites/regime IRB conforme as formulas parametrizadas.                                                                | D/X   |
| ELIM0053-0055, 0071-0097, 0192-0197, 0208, 0216, 0420, 0424, 0428, 0432, 0436, 0440, 0444, 0458-0463, 0527-0540, 0586-0587, 2012, 2017, 2022 e 2024                            | Recalcular metodologias BIA/ASA/ASA2, janelas T-3/T-2/T-1, pesos de linha de negocio, RWAOPAD, RWAMPAD, risco de mercado e modelos internos.                                                           | D/X   |
| ELIM0494, 0495, 0498, 0515-0517, 0520, 0588-0595, 0622-0627, 2023, 2034 e 2035                                                                                                 | Recalcular RA, LEC, LECO, LCSP e LOC; verificar margens, maior exposicao, ordenacao das exposicoes e contas de competencia.                                                                            | D/X   |
| ELIM0030, 0035, 0036, 0106, 0116, 0346, 0495, 0541-0542, 0570, 0576-0578, 0614, 2026-2027 e 2034                                                                               | Aplicar gates por tipo de conglomerado, segmento, cooperativa, regime prudencial, autorizacao de modelo, habilitacao e CNPJ do provedor.                                                               | D/X   |
| `Conta de Geracao!F`                                                                                                                                                           | Recalcular todas as 363 formulas de contas geradas, como soma de componentes e produto de saldo por percentual/FPR. Comparar o resultado ao saldo informado.                                           | D     |

## Criticas de pos-processamento

Estas criticas nao devem rejeitar a sintaxe de entrada: o documento entra como aceito e a verificacao gera indicio. A descricao, mensagem, gravidade e vigencia exatas estao em `criticas-de-pos-processamento.xlsx!Sheet0!A:H`. Codigos vencidos devem ser mantidos apenas para reproduzir analises historicas.

| Codigo(s)         | Validacao                                                                                                                                                 | Dados |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| DLO00001-DLO00003 | Reconciliar elemento 2 e `saldoCosif` com `valorCosif`.                                                                                                   | D     |
| DLO00004-DLO00007 | Recalcular detalhe RWACPAD pela combinacao de exposicao, FPR, mitigador e FCC.                                                                            | D     |
| DLO00008-DLO00010 | Reconciliar detalhes RWACPAD com COSIF, validar codigo COSIF vigente e o menor nivel de desmembramento.                                                   | X     |
| DLO00011-DLO00018 | Reconciliar componentes de risco de mercado com DDR: cambio, VaR, stressed VaR, juros, commodities e acoes.                                               | X     |
| DLO00019-DLO00032 | Reconciliar contas de PR, reservas, resultados, depositos, instrumentos, tesouraria, investimentos e creditos tributarios com as contas COSIF prescritas. | X     |
| DLO00033-DLO00039 | Comparar imobilizacao, participacoes de nao controladores e relacao funcional conta DLO-COSIF contra COSIF e mapeamento oficial.                          | X     |
| DLO00040          | Tipo 33 no RWACPAD requer RWAMPAD ou RWAMINT nao nulo.                                                                                                    | D     |
| DLO00041-DLO00042 | Reconciliar capital social e provisao/credito a liberar com COSIF e SCR.                                                                                  | X     |
| DLO00043-DLO00045 | Verificar estabilidade semestral do RWAOPAD e variacao de conta 870 nos marcos de semestre.                                                               | H     |
| DLO00046          | FPR `99099999` somente em tipos nao exposicao, salvo mitigador 196.                                                                                       | D     |
| DLO00047-DLO00057 | Cobertura de exposicoes COSIF no RWACPAD e reconciliacao de caixa, reservas, depositos, interbancario, cambio, compromissadas e derivativos.              | X     |
| DLO00058          | Para RA aplicavel, `146.01.02 = 605.05 + 605.06`.                                                                                                         | D     |
| DLO00060-DLO00065 | ASA e ASA2 devem informar valor/conta em cada periodo T-3, T-2 e T-1.                                                                                     | D     |
| DLO00066-DLO00067 | Verificar classificacao exclusiva de exposicoes e garantias contra COSIF/SCR.                                                                             | D/X   |
| DLO00068          | Recalcular valor de detalhe RWACPAD por exposicao, FPR, FCC e mitigador.                                                                                  | D     |
| DLO00069-DLO00075 | Reconciliar classificacoes FPR 0%, capital destacado e detalhes COSIF de PR/RWACPAD.                                                                      | X     |
| DLO00076-DLO00079 | Recalcular RWACPAD com FCC/provisao/FPR e consistencia de deducoes e tipos 33/37/38.                                                                      | D     |
| DLO00080-DLO00082 | Validar ajustes de avaliacao e classificacoes FPR/mitigadores contra COSIF e SCR.                                                                         | X     |
| DLO00083-DLO00090 | IRRBB positivo quando ha carteira bancaria e reconciliacao dos componentes RWAOPAD com informacao contabil externa.                                       | X     |
| DLO00091          | Detalhe LEC e igual a elemento 63 mais elementos 46 e 47.                                                                                                 | D     |
| DLO00092-DLO00095 | Adicional sistemico, aumentos de capital, FPR de credito e uso de FPR cooperativo consistentes com cadastros e COSIF.                                     | X     |
| DLO00096-DLO00100 | Limites de contas IRRBB e consistencia de cenarios/maior variacao EVE com os detalhes.                                                                    | D     |
| DLO00101          | Contas LEC nao incluem clientes excepcionados BCB/Tesouro.                                                                                                | D     |
| DLO00102-DLO00118 | Reconciliar ajustes prudenciais, impostos diferidos, investimentos, perdas acumuladas e exposicoes SA-CCR com COSIF.                                      | X     |
| DLO00119-DLO00124 | Reconciliar LEC e LCSP por classe de exposicao com SCR e CADIP.                                                                                           | X     |
| DLO00125          | Modelo interno de mercado 770 usa maximo e transicao regulamentar corretos.                                                                               | D/H   |
| DLO00126-DLO00128 | Reconciliar credito tributario temporario, intangivel e prejuizo fiscal/CSLL com COSIF.                                                                   | X     |
| DLO00129          | Pares moeda-fator de risco IRRBB sao permitidos.                                                                                                          | D     |
| DLO00130-DLO00131 | LEC nao pode ter maior exposicao zero se ha ativos COSIF com contraparte; grupos SCR acima de 10% do PR devem ser reportados.                             | X     |
| DLO00132-DLO00142 | Reconciliar deducoes, ACCPi por jurisdicao, creditos tributarios e classificacoes FPR de precatorios/litigios com COSIF e BIS.                            | D/X   |
| DLO00143          | Valores ponderados de elemento 2 no RWACPAD sao positivos.                                                                                                | D     |
| DLO00144          | Parametro 6 corresponde ao segmento vigente no Sistema Limites, inclusive reavaliacao semestral.                                                          | X     |
| DLO00145          | RWAMINT corresponde ao DDR ajustado pelo fator F.                                                                                                         | X     |
| DLO00146          | Detalhe RWACPAD contabil exige detalhe COSIF, exceto tipos 21, 51, 62 e 72.                                                                               | D     |
| DLO00147-DLO00149 | RWASP-MOE, RWASP-ADQ e RWASP-PISP seguem as formulas ponderadas de COSIF.                                                                                 | X     |
| DLO00150          | Cada detalhe RWAOPAD possui detalhe COSIF ou `valorCosif`.                                                                                                | D     |
| DLO00151-DLO00153 | Reconciliar credito a liberar, reserva de capital e mitigador 268 com COSIF/SCR.                                                                          | X     |
| DLO00154          | Soma de instrumentos de capital por conta DLO corresponde a conta DLO.                                                                                    | D     |
| DLO00155-DLO00158 | Reconciliar instrumentos de capital com COSIF e validar coerencia/validade das contas DLO e COSIF.                                                        | D/X   |
| DLO00159-DLO00160 | Reconciliar agregados de detalhe COSIF RWAOPAD com COSIF comparativo e resultado total.                                                                   | X     |
| DLO00161          | Componente de perda operacional `875.01.01` corresponde ao calculo DRO.                                                                                   | X     |
| DLO00162          | Reconciliar credito tributario temporario rural com COSIF.                                                                                                | X     |
| DLO00163          | `idTitulo` de instrumento de capital existe como contrato B3.                                                                                             | X     |
| LIM01006          | Versao historica de exigencia de COSIF no RWAOPAD.                                                                                                        | D     |
| LIM01009          | Reconciliar expressao COSIF parametrizada contra contas DLO indicadas.                                                                                    | X     |
| LIM01011          | Versao historica da conciliacao de mitigador 268 com SCR.                                                                                                 | X     |
| LIM01012          | De 2026-03 em diante, exposicao FPR `94060100` nao excede o valor congelado de 2026-02.                                                                   | H     |
| LIM01013          | Versao historica da validacao de titulo de instrumento de capital na B3.                                                                                  | X     |

## Dependencias necessarias para cobertura integral

| Dependencia                            | Validacoes habilitadas                                                                                                                                                                                             |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Configuracao versionada por data-base  | Todas as regras de entrada, dominios, contas, elementos, sinais, formulas e mensagens ELIM.                                                                                                                        |
| Cadastro institucional/Sistema Limites | Escopo, segmento, regime prudencial, conglomerado, cooperativa, autorizacoes e limites aplicaveis.                                                                                                                 |
| Historico de DLOs aceitos              | DLO00043-DLO00045, DLO00125 e LIM01012.                                                                                                                                                                            |
| COSIF e mapeamento DLO-COSIF           | DLO00008-DLO00010, DLO00019-DLO00039, DLO00041, DLO00047-DLO00057, DLO00069-DLO00075, DLO00080, DLO00084-DLO00090, DLO00102-DLO00118, DLO00126-DLO00128, DLO00132-DLO00142, DLO00147-DLO00152 e DLO00155-DLO00160. |
| DDR                                    | DLO00011-DLO00018 e DLO00145.                                                                                                                                                                                      |
| SCR e CADIP                            | DLO00042, DLO00048, DLO00067, DLO00082, DLO00119-DLO00124, DLO00131 e DLO00153.                                                                                                                                    |
| BIS/CCyB, DRO e B3                     | DLO00133, DLO00161 e DLO00163.                                                                                                                                                                                     |

## Limites desta documentacao

O catalogo permite implementar todas as verificacoes descritas e todas as formulas que tenham seus insumos fornecidos. Ele nao permite reconstruir dados que o repositorio nao contem: saldos COSIF oficiais, DDR, SCR, CADIP, cadastro B3, planilha BIS, DRO, perfil vigente da instituicao e historico de protocolos. Essas regras devem ser implementadas como criticas condicionais: executar quando a dependencia estiver disponivel e informar claramente a ausencia da fonte quando nao estiver.

O `validation-schema.xsd` declara no cabecalho vigencia a partir de 2024-12 e ainda restringe `cnpj` a oito digitos numericos. Para data-base 2026-07, a regra documental sobre CNPJ alfanumerico e a configuracao vigente devem prevalecer; a adequacao do XSD e uma validacao de consistencia do proprio validador.
