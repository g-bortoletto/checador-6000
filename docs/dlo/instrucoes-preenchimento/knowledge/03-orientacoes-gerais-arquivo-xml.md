---
source_document: "INSTRUÇÕES DE PREENCHIMENTO DO DEMONSTRATIVO DE LIMITES OPERACIONAIS 2026/07"
source_sections:
  - "3: – ORIENTAÇÕES GERAIS SOBRE O ARQUIVO XML"
source_pages:
  start: 6
  end: 13
---
# – ORIENTAÇÕES GERAIS SOBRE O ARQUIVO XML

* 1. O arquivo deve começar, na primeira linha, com o campo Instrução de Processamento em conformidade com o Leiaute do documento, e conforme exemplo abaixo:

<?xml version="1.0" encoding="UTF-8"?>

* 1. A segunda linha representa a abertura da *tag* “documentoDLO”, que possui os seguintes atributos “CNPJ da instituição”, “Data-base”, “codigoDocumento” e “tipoEnvio”. Para esses campos deve-se atentar para os seguintes pontos: o CNPJ informado deverá ser composto pelos 8 primeiros algarismos (até 2026-06, e alfanumérico de 2026-07 em diante) do CNPJ da instituição não vinculada a conglomerado, ou pelo CNPJ da instituição líder de conglomerado, conforme o caso; a data-base deve vir no formato AAAA-MM, com atenção especial ao separador “-“; o campo codigoDocumento deve ser preenchido com o código 2061; para o campo tipoEnvio ”, espera-se a atribuição de “I” - Inclusão ou “D” – Substituição por Determinação ou “E” – Substituição Espontânea, conforme Tabela 014, para indicar que se trata de inclusão de documento ou substituição de documento. A *tag* documentoDLO, possui subtags: limitesInformados, parametros, contas e instrumentosCapital, que são tratadas mais abaixo. Um exemplo da abertura e do fechamento da *tag* é apresentada a seguir:

<documentoDLO cnpj="12345678" dataBase="2019-01" codigoDocumento="2061" tipoEnvio="I" codigoConglomerado="C2345678">

....

</documentoDLO>

* 1. No campo “Limites informados pela instituição” são informados os códigos dos limites a que a instituição está sujeita. Este campo possui *tags* para indicar se as informações relativamente a cada limite foram enviadas, ou seja, que as contas relativas à apuração desses limites foram informadas, conforme Tabela 001 e Tabela 002.

<limitesInformados>

<limite codigoLimite="03.00" enviado="S"/>

<limite codigoLimite="05.00" enviado="S"/>

<limite codigoLimite="09.00" enviado="N"/>

<limite codigoLimite="37.00" enviado="N"/>

<limite codigoLimite="51.00" enviado="N"/>

<limite codigoLimite="52.00" enviado="N"/>

<limite codigoLimite="70.00" enviado="S"/>

<limite codigoLimite="80.00" enviado="S"/>

<limite codigoLimite="81.00" enviado="S"/>

</limitesInformados>

* 1. No campo “Parâmetro”, são informados os códigos dos parâmetros, conforme Tabela 006, que indicam situações especificas para diferentes instituições. Para o código parâmetro “11”, espera-se a atribuição de um dos valores definidos na Tabela 013, correspondente à informação de que a instituição passou por processo de fusão, cisão ou incorporação no período base de apuração do risco operacional (últimos 6 semestres findos, caso a instituição não possua os últimos 6 semestres findos informar **“S”**). Para o código parâmetro “5”, espera-se a atribuição de um dos valores definidos na Tabela 030, correspondentes à opção de abordagem de mitigador de risco, conforme exemplo abaixo:

<parametros>

<parametro codigoParametro="4" valorParametro="2"/>

<parametro codigoParametro="5" valorParametro="1"/>

<parametro codigoParametro="6" valorParametro="3"/>

<parametro codigoParametro="7" valorParametro="02"/>

<parametro codigoParametro="8" valorParametro="2"/>

<parametro codigoParametro="11" valorParametro="N"/>

<parametro codigoParametro="22" valorParametro="T"/>

<parametro codigoParametro="25" valorParametro="01234567000189"/>

<parametro codigoParametro="31" valorParametro="FULANO DE TAL"/>

<parametro codigoParametro="32" valorParametro="61-3123-4567"/>

<parametro codigoParametro="33" valorParametro="FULANA@DETAL.COM.BR"/>

</parametros>

* 1. A *Tag* “Contas”, possui *subtags* “Conta” neste último campo os valores devem ser informados em conformidade com as descrições das contas na Tabela 003. Os valores devem ser registrados em unidade monetária R$ 1,00, com 2 (duas) casas decimais separadas por “.”, o valor deve ser truncado após as casas decimais, ignorando-se frações de centavos. Cada conta pode possuir *subtags*, para detalhamento dos valores informados, e/ou para detalhamento contábil, e/ou ainda para detalhamento de cliente. As descrições dessas tags são dadas abaixo, e diferem para cada conjunto de contas “A”, “D”, “E”, “F”, “H”, “J”, “K” e “L” destacados na Tabela 003. Conforme exemplos abaixo:
* Apresentação da tag contas:

<contas>

<conta codigoConta="100" valorConta="1234567.89" valorCosif="0.00"/>

<conta codigoConta="101" valorConta="1234567.89" valorCosif="0.00"/>

.....

</contas>

* Detalhamento do Patrimônio de Referência (A):
  + Conta sem detalhamento contábil e sem detalhamento da informação:

<conta codigoConta="100" valorConta="1234567.89" valorCosif="0.00"/>

- Conta com detalhamento contábil e sem detalhamento da informação:

<conta codigoConta="111.01" valorConta="1234567.89" valorCosif="1234567.89">

<detalhamentosCosif>

<detalhamentoCosif codigoCosif="6111013007" saldoCosif="1000000.00"/>

<detalhamentoCosif codigoCosif="6111016004" saldoCosif="234567.89"/>

</detalhamentosCosif>

</conta>

- Conta com detalhamento contábil e com detalhamento da informação:

<conta codigoConta="111.91.02.01" valorConta="100.00" valorCosif="100.00">

<detalhamentosDLO>

<detalhamentoDLO valorDetalhe="100.00">

<detalhe codigoElemento="2" valorElemento="100.00"/>

<detalhe codigoElemento="9" valorElemento="1"/>

</detalhamentoDLO>

</detalhamentosDLO>

<detalhamentosCosif>

<detalhamentoCosif codigoCosif="6191010009" saldoCosif="100.00"/>

</detalhamentosCosif>

</conta>

* Detalhamento do RWACPAD (D):
  + Conta com detalhamento contábil e com detalhamento da informação:

<conta codigoConta="510.01" valorConta="0.00" valorCosif="200.00">

<detalhamentosDLO>

<detalhamentoDLO valorDetalhe="0.00">

<detalhe codigoElemento="2" valorElemento="100.00"/>

<detalhe codigoElemento="4" valorElemento="11"/>

<detalhe codigoElemento="41" valorElemento="10010000"/>

<detalhe codigoElemento="42" valorElemento="99"/>

<detalhe codigoElemento="43" valorElemento="99"/>

<detalhe codigoElemento="45" valorElemento="999"/>

</detalhamentoDLO>

<detalhamentoDLO valorDetalhe="0.00">

<detalhe codigoElemento="2" valorElemento="100.00"/>

<detalhe codigoElemento="4" valorElemento="11"/>

<detalhe codigoElemento="41" valorElemento="11010000"/>

<detalhe codigoElemento="42" valorElemento="99"/>

<detalhe codigoElemento="43" valorElemento="99"/>

<detalhe codigoElemento="45" valorElemento="999"/>

</detalhamentoDLO>

</detalhamentosDLO>

<detalhamentosCosif>

<detalhamentoCosif codigoCosif="11110006" saldoCosif="100.00"/>

<detalhamentoCosif codigoCosif="11540009" saldoCosif="100.00"/>

</detalhamentosCosif>

</conta>

- Conta sem detalhamento contábil e sem detalhamento da informação:

<conta codigoConta="530" valorConta="312829988.38" valorCosif="0.00"/>

* Detalhamento do RWAOPAD (E):
  + Conta sem detalhamento contábil:

<conta codigoConta="875" valorConta="1234567.89" valorCosif="0.00"/>

- Conta com detalhamento contábil:

<conta codigoConta="875.15.10.10" valorConta="100.00" valorCosif="100.00">

<detalhamentosCosif>

<detalhamentoCosif codigoCosif="7110530009" saldoCosif="100.00"/>

</detalhamentosCosif>

</conta>

* Detalhamento do IRRBB (F):
  + Conta sem detalhamento da informação:

<conta codigoConta="890" valorConta="88751992.65" valorCosif="0.00"/>

- Contas com detalhamento da informação:

<conta codigoConta="891" valorConta="88751992.65" valorCosif="0.00">

<detalhamentosDLO>

<detalhamentoDLO valorDetalhe="88751992.65">

<detalhe codigoElemento="55" valorElemento="2"/>

<detalhe codigoElemento="56" valorElemento="1"/>

<detalhe codigoElemento="57" valorElemento="252"/>

<detalhe codigoElemento="58" valorElemento="2"/>

<detalhe codigoElemento="59" valorElemento="2726160671.43"/>

</detalhamentoDLO>

</detalhamentosDLO>

</conta>

<conta codigoConta="891.10.10.01" valorConta="200.00" valorCosif="0.00">

<detalhamentosDLO>

<detalhamentoDLO valorDetalhe="100.00">

<detalhe codigoElemento="54" valorElemento="1"/>

<detalhe codigoElemento="83" valorElemento="BRL"/>

</detalhamentoDLO>

<detalhamentoDLO valorDetalhe="100.00">

<detalhe codigoElemento="54" valorElemento="2"/>

<detalhe codigoElemento="83" valorElemento="BRL"/>

</detalhamentoDLO>

</detalhamentosDLO>

</conta>

* Detalhamento da RA (H) **(NR)**:

- Conta sem detalhamento da informação:

<conta codigoConta="141" valorConta="100.00" valorCosif="0.00"/>

- Contas com detalhamento da informação:

<conta codigoConta="147.90.10.20.20.03" valorConta="100.00" valorCosif="0.00">

<detalhamentosDLO>

<detalhamentoDLO valorDetalhe="100.00">

<detalhe codigoElemento="2" valorElemento="10000.00"/>

<detalhe codigoElemento="43" valorElemento="31"/>

</detalhamentoDLO>

</detalhamentosDLO>

</conta>

* Detalhamento do LCSP (J):
  + Conta sem detalhamento da informação:

<conta codigoConta="170" valorConta="100.00" valorCosif="0.00">

- Contas com detalhamento da informação:

<conta codigoConta="172.01" valorConta="90.00" valorCosif="0.00">

<detalhamentosDLO>

<detalhamentoDLO valorDetalhe="90.00">

<detalhe codigoElemento="2" valorElemento="100.00"/>

<detalhe codigoElemento="46" valorElemento="-10.00"/>

<detalhe codigoElemento="61" valorElemento="9"/>

<detalhe codigoElemento="62" valorElemento="1"/>

</detalhamentoDLO>

</detalhamentosDLO>

</conta>

* Detalhamento do LEC e LECO (K e L):
  + Conta sem detalhamento da informação:

<conta codigoConta="200" valorConta="1000.00" valorCosif="0.00"/>

- Contas com detalhamento da informação de cliente não caracterizado como grupo de contrapartes conectadas:

<conta codigoConta="200.03" valorConta="550000.00">

<cliente identificacaoCliente="12345678" tipoCliente="02" nomeCliente="CDEF LTD"/>

<detalhamentosDLO>

<detalhamentoDLO valorDetalhe="550000.00">

<detalhe codigoElemento="63" valorElemento="550000.00"/>

<detalhe codigoElemento="46" valorElemento="0.00"/>

<detalhe codigoElemento="64" valorElemento="0.00"/>

<detalhe codigoElemento="65" valorElemento="0.00"/>

<detalhe codigoElemento="66" valorElemento="01"/>

<detalhe codigoElemento="67" valorElemento="02"/>

<detalhe codigoElemento="62" valorElemento="09"/>

<detalhe codigoElemento="68" valorElemento="02"/>

</detalhamentoDLO>

</detalhamentosDLO>

</conta>

- Contas com detalhamento da informação de cliente caracterizado como grupo de contrapartes conectadas:

<conta codigoConta="200.01" valorConta="1742000.00">

<cliente identificacaoCliente="ABCD" tipoCliente="7" nomeCliente="ABCD S.A.">

<detalhamentosCliente>

<detalhamentoCliente identificacaoParticipante="99999999" tipoParticipante="02" razaoParticipante="01"/>

<detalhamentoCliente identificacaoParticipante="88888888" tipoParticipante="02" razaoParticipante="02"/>

<detalhamentoCliente identificacaoParticipante="ABCD LTD" tipoParticipante="04" razaoParticipante="05"/>

</detalhamentosCliente>

</cliente>

<detalhamentosDLO>

<detalhamentoDLO valorDetalhe="1492500.00">

<detalhe codigoElemento="63" valorElemento="1500000.00"/>

<detalhe codigoElemento="46" valorElemento="-7500.00"/>

<detalhe codigoElemento="64" valorElemento="0.00"/>

<detalhe codigoElemento="65" valorElemento="0.00"/>

<detalhe codigoElemento="66" valorElemento="01"/>

<detalhe codigoElemento="67" valorElemento="02"/>

<detalhe codigoElemento="62" valorElemento="06"/>

<detalhe codigoElemento="68" valorElemento="01"/>

</detalhamentoDLO>

<detalhamentoDLO valorDetalhe="150000.00">

<detalhe codigoElemento="63" valorElemento="300000.00"/>

<detalhe codigoElemento="46" valorElemento="0.00"/>

<detalhe codigoElemento="64" valorElemento="150000.00"/>

<detalhe codigoElemento="65" valorElemento="0.00"/>

<detalhe codigoElemento="66" valorElemento="03"/>

<detalhe codigoElemento="67" valorElemento="01"/>

<detalhe codigoElemento="62" valorElemento="05"/>

<detalhe codigoElemento="68" valorElemento="01"/>

</detalhamentoDLO>

<detalhamentoDLO valorDetalhe="99500.00">

<detalhe codigoElemento="63" valorElemento="100000.00"/>

<detalhe codigoElemento="46" valorElemento="-500.00"/>

<detalhe codigoElemento="64" valorElemento="0.00"/>

<detalhe codigoElemento="65" valorElemento="0.00"/>

<detalhe codigoElemento="66" valorElemento="09"/>

<detalhe codigoElemento="67" valorElemento="02"/>

<detalhe codigoElemento="62" valorElemento="09"/>

<detalhe codigoElemento="68" valorElemento="01"/>

- Contas sem detalhamento da informação de cliente com detalhamento de informações:

<conta codigoConta="200.70" valorConta="5000000.00">

<detalhamentosDLO>

<detalhamentoDLO valorDetalhe="5000000.00">

<detalhe codigoElemento="72" valorElemento="3"/>

</detalhamentoDLO>

</detalhamentosDLO>

</conta>

<conta codigoConta="200.80" valorConta="3000000.00">

<detalhamentosDLO>

<detalhamentoDLO valorDetalhe="3000000.00">

<detalhe codigoElemento="63" valorElemento="3000000.00"/>

<detalhe codigoElemento="81" valorElemento="BR"/>

<detalhe codigoElemento="69" valorElemento="01"/>

</detalhamentoDLO>

</detalhamentosDLO>

</conta>

<conta codigoConta="200.90" valorConta="25000.00">

<detalhamentosDLO>

<detalhamentoDLO valorDetalhe="25000.00">

<detalhe codigoElemento="70" valorElemento="5500000.00"/>

<detalhe codigoElemento="71" valorElemento="4700000.00"/>

<detalhe codigoElemento="72" valorElemento="3"/>

</detalhamentoDLO>

</detalhamentosDLO>

</conta>

* 1. Os códigos de elementos devem ser informados para cada grupo de contas, exceto quando opcionais ou aplicáveis a contas específicas. Se obrigatórios, e não aplicáveis, utilize o código correspondente a 'não se aplica' ou zero (para valores). Os códigos de elementos estão na Tabela 004 e seus detalhes nas Tabelas 005, 009 a 012, 024, 025, 027 a 029, 033 a 035 e 041 a 047. Os códigos devem corresponder à configuração de contas do item V-D. Caso haja divergência, a instituição pode solicitar alteração ao Desig, conforme disposto nos tópicos preliminares do referido item.
  2. Os valores das contas são detalhados em tags, e a soma desses detalhes ('valorDetalhe') deve corresponder ao saldo da conta. O documento será rejeitado se a soma dos detalhes não coincidir com o saldo. Em detalhamento único, o 'valorDetalhe' deve ser igual ao saldo da conta.

<conta codigoConta="172.01" valorConta="90.00" valorCosif="0.00">

<detalhamentosDLO>

<detalhamentoDLO valorDetalhe="90.00">

<detalhe codigoElemento="2" valorElemento="100.00"/>

<detalhe codigoElemento="46" valorElemento="-10.00"/>

<detalhe codigoElemento="61" valorElemento="9"/>

<detalhe codigoElemento="62" valorElemento="1"/>

* 1. Todos os valores de exposições, sejam eles incluídos ou excluídos do cálculo do RWACPAD, ou que não representem exposições, mas possuam registros contábeis, devem ser acompanhados de um detalhamento que permita a reconciliação com os registros contábeis.
  2. Contas com indicação específica de detalhamento cosif para o RWACPAD, PR e RWAOPAD devem incluir os campos 'codigoCosif' e 'saldoCosif'. O 'codigoCosif' deve ser informado no maior nível de desmembramento de contas Cosif existente. O 'saldoCosif' deve ser informado com o saldo constante no demonstrativo contábil (4010/4016/4060/4066) proporcional ao valor da conta DLO. A soma dos 'saldoCosif' deve igualar o 'valorCosif'. Valores redutores usam sinal negativo. Valores positivos, nenhum sinal. Para o RWAOPAD, informe receita e despesas dos últimos 6 semestres anteriores à data base do DLO. O relatório de configuração de contas indica as contas sujeitas a este detalhamento.

<conta codigoConta="111.91.02.01" valorConta="100.00" valorCosif="100.00">

<detalhamentosDLO>

<detalhamentoDLO valorDetalhe="100.00">

<detalhe codigoElemento="2" valorElemento="100.00"/>

<detalhe codigoElemento="9" valorElemento="1"/>

</detalhamentoDLO>

</detalhamentosDLO>

<detalhamentosCosif>

<detalhamentoCosif codigoCosif="6191010009" saldoCosif="100.00"/>

</detalhamentosCosif>

</conta>

* 1. As contas 200.01 a 200.60, relacionadas ao Limite de exposições concentradas e ao Limite de exposição por cliente, devem incluir a tag 'cliente' para identificação do cliente, com os campos: identificação, tipo e nome. Caso o cliente represente um grupo econômico, a tag 'detalhamentoCliente' é necessária, contendo os campos: identificação do participante, tipo de participante e razão de participação.

<cliente identificacaoCliente="ABCD" tipoCliente="7" nomeCliente="ABCD S.A.">

<detalhamentosCliente>

<detalhamentoCliente identificacaoParticipante="99999999" tipoParticipante="02" razaoParticipante="01"/>

<detalhamentoCliente identificacaoParticipante="88888888" tipoParticipante="02" razaoParticipante="02"/>

<detalhamentoCliente identificacaoParticipante="ABCD LTD" tipoParticipante="04" razaoParticipante="05"/>

</detalhamentosCliente>

</cliente>

* 1. As informações dos instrumentos de captação elegíveis a capital são registradas na tag 'instrumentosCapital', com uma tag 'instrumentoCapital' para cada instrumento. As informações específicas para cada instrumento estão detalhadas no item 15 do Capítulo II – Orientações Gerais, e incluem: idTitulo, localEmissor, codigoEmissor, idRegistradora, contaDlo, contaCosif, saldoCapital, saldoContabil e tipoClausula. Segue abaixo exemplo:

<instrumentosCapital>

<instrumentoCapital idTitulo="IECE1000001" localEmissor="01" codigoEmissor="12345678" idRegistradora="10" contaDLO="112.01" contaCosif="49998207" saldoCapital="10000000000.00" saldoContabil="10000000000.00" tipoClausula="01"/>

<instrumentoCapital idTitulo="IECP1000002" localEmissor="01" codigoEmissor="12345678" idRegistradora="10" contaDLO="111.08" contaCosif="49998104" saldoCapital="500000000.00" saldoContabil="500000000.00" tipoClausula="03"/>

<instrumentoCapital idTitulo="LFSC10000XY" localEmissor="01" codigoEmissor="12345678" idRegistradora="10" contaDLO="112.01" contaCosif="49998207" saldoCapital="1000000.00" saldoContabil="1000000.00" tipoClausula="01"/>

</instrumentosCapital>

