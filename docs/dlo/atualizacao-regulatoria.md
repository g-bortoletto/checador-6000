# Atualizacao Regulatoria DLO 2061

1. Registrar a planilha ou documento regulatorio recebido, sua origem, data de publicacao e vigencia.
2. Extrair os artefatos para uma nova versao imutavel da configuracao; nao sobrescrever a versao anteriormente publicada.
3. Comparar listas, dominios, ELIMs, RGRs, formulas e mensagens contra a versao anterior e revisar cada diferenca de vigencia.
4. Atualizar o manifesto de cobertura com catalogo, RGR, ELIM, data-base, dependencia e justificativa afetados.
5. Adicionar fixtures de regressao para cada regra, formula ou vigencia alterada, incluindo um caso valido e um caso rejeitado ou de indicio.
6. Executar `npm run typecheck`, `npm test` e `npm run build`; revisar qualquer mudanca no relatorio de cobertura.
7. Obter aprovacao regulatoria e tecnica antes de publicar a configuracao e registrar a decisao com o diff revisado.
