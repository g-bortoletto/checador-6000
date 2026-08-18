# Manifesto de Cobertura DLO 2061

Este manifesto registra o estado da cobertura local. Intervalos incluem todos os codigos entre os extremos. `blocked` significa que a regra nao e executada ate que a dependencia indicada esteja disponivel; nao significa aprovacao do documento.

| Catalogo | Estado | Data-base | Dependencia ou justificativa |
| --- | --- | --- | --- |
| PRE-XML-001 a PRE-XML-012 | implemented | 2008-07 a 2049-12 | Parser semantico, validação estrutural e XSD; PRE-XML-008 aplica a excecao documental a partir de 2026-07. |
| PRE-REF-001 a PRE-REF-009 | blocked | Todas | Configuracao versionada por data-base. |
| PRE-EST-001 a PRE-EST-012 | blocked | Todas | Configuracao versionada por data-base. |
| PRE-VAL-001 a PRE-VAL-010 | blocked | Todas | Configuracao versionada e perfil institucional verificavel quando aplicavel. |
| ELIM0001 a ELIM9999 | blocked | Todas | Motor de regras RGR e configuracao versionada ainda nao foram implementados. |
| RGR02882 a RGR07645 | blocked | A definir pela configuracao | Importacao versionada de `regras.csv` e DSL ainda nao foram implementadas. |
| DLO00001 a DLO00163 | blocked | Conforme vigencia da critica | Executor de pos-processamento ainda nao foi implementado; fontes externas sao declaradas no catalogo. |
| LIM01006, LIM01009, LIM01011 a LIM01013 | blocked | Conforme vigencia da critica | Executor de pos-processamento e dependencias historicas/externas ainda nao foram implementados. |
