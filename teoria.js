/**
 * Módulo: Teoria Fundamental
 * Arquivo: teoria.js
 * Conteúdo: Módulo 1 - Análise Léxica (Detalhado)
 */

const teoriaQuestions = [
    // ========================================================================
    // TÓPICO: ANÁLISE LÉXICA (O ESCRIBA / SCANNER)
    // ========================================================================
    {
        title: "Módulo 1: Análise Léxica (O Escriba)",
        initialGrammar: 
`A primeira fase da compilação.
Também conhecida como "Scanning" ou "Tokenização".

Entrada: Código Fonte (Fluxo de Caracteres)
Processo: Agrupamento, Classificação e Limpeza
Saída: Fluxo de Tokens`,
        steps: [
            // PASSO 1: O CONCEITO FUNDAMENTAL
            {
                title: "1. A Natureza da Matéria Bruta",
                theory: "Kaelil: 'Antes de entender o significado, devemos identificar a forma.'",
                explanation: "O computador não vê 'if'. Ele vê os códigos ASCII '105' (i) e '102' (f). O trabalho do Analisador Léxico é ler esse fluxo contínuo de caracteres e agrupar letras soltas em palavras significativas.",
                result: 
`Entrada Bruta:
"i" "n" "t" " " "x" " " "=" " " "1" "0" ";"

O Escriba lê e agrupa:
[int] [x] [=] [10] [;]

Ele transforma "poeira" (caracteres) em "tijolos" (lexemas).`
            },

            // PASSO 2: TOKEN VS LEXEMA VS PADRÃO
            {
                title: "2. A Trindade da Identificação",
                theory: "Erandur define as distinções formais cruciais:",
                explanation: "Não confunda o nome da coisa com a categoria da coisa.",
                result: 
`1. LEXEMA (A Palavra Real):
   É a sequência exata de caracteres no código fonte.
   Ex: "variavel_x", "123", "if".

2. PADRÃO (A Regra):
   A regra que descreve o que forma um lexema válido.
   Ex: "Uma letra seguida de letras ou números".

3. TOKEN (A Categoria Abstrata):
   O par <Nome, Atributo> que o sintático vai receber.
   Ex: <ID, "variavel_x">, <NUM, 123>, <IF, ->`
            },

            // PASSO 3: A MÁQUINA (REGEX E AUTÔMATOS)
            {
                title: "3. O Mecanismo Interno (Regex & DFA)",
                theory: "Como o computador sabe que '123' é um número e não uma variável?",
                explanation: "Usamos Expressões Regulares para definir os padrões e Autômatos Finitos Determinísticos (DFA) para implementá-los.",
                result: 
`Padrão para Inteiro (Regex): [0-9]+
Padrão para ID (Regex): [a-zA-Z][a-zA-Z0-9]*

O Autômato Léxico lê caractere por caractere:
- Estado Inicial.
- Leu dígito? Vai para Estado 'Número'.
- Leu letra? Vai para Estado 'Identificador'.
- Leu espaço? Emite o Token e reinicia.`
            },

            // PASSO 4: A LIMPEZA (WHITESPACE E COMENTÁRIOS)
            {
                title: "4. A Peneira de J'zargo",
                theory: "J'zargo: 'Ouro fica, terra sai.'",
                explanation: "Uma das funções vitais do Léxico é descartar o que não importa para a lógica: espaços em branco (whitespace), tabulações, quebras de linha e comentários.",
                result: 
`Código Fonte:
// Isso é um contador
int    c  =  1; 

O que o Sintático recebe:
<INT> <ID, "c"> <ASSIGN> <NUM, 1> <SEMICOLON>

O comentário e os espaços extras desapareceram. O parser nem sabe que eles existiram.`
            },

            // PASSO 5: TRATAMENTO DE ERROS LÉXICOS
            {
                title: "5. O Erro Léxico (A Pedra Estranha)",
                theory: "O que acontece quando o scanner encontra algo que não se encaixa em nenhum padrão?",
                explanation: "Se o automato trava e não consegue classificar o caractere atual, temos um Erro Léxico. O Léxico geralmente 'pânico' (ignora o caractere e tenta continuar) para achar mais erros.",
                result: 
`Código: int $valor = 10;

1. Lê "int" -> Token <INT>
2. Lê " " -> Ignora.
3. Lê "$" -> ERRO! 
   Não há regra na linguagem C que permita '$' iniciar uma instrução.
   Mensagem: "Caractere inválido '$' na linha 1."`
            },

            // PASSO 6: A TABELA DE SÍMBOLOS (PRIMEIRO CONTATO)
            {
                title: "6. A Tabela de Símbolos (O Início)",
                theory: "O Léxico é o primeiro a tocar na Tabela de Símbolos.",
                explanation: "Quando o Léxico encontra um Identificador (ex: 'minhaVar'), ele verifica se já está na Tabela de Símbolos. Se não, ele pode adicioná-lo (dependendo da implementação do compilador).",
                result: 
`Ao ler "int contador = 5;":

1. <INT> gerado.
2. <ID, "contador"> gerado. 
   -> O Lexema "contador" é salvo na Tabela de Símbolos para que o Semântico possa consultá-lo depois.`
            }
        ]
    },
    //MODULO 2
    {
        title: "Módulo 2: Análise Sintática (O Arquiteto)",
        initialGrammar: 
`A segunda e mais estrutural fase da compilação.
Responsável pela hierarquia e validade gramatical.

Entrada: Fluxo de Tokens (do Léxico)
Processo: Construção da Árvore de Derivação
Saída: Árvore Sintática Abstrata (AST)`,
        steps: [
            // PASSO 1: O CONCEITO
            {
                title: "1. A Missão da Sintaxe",
                theory: "Erandur: 'Não basta ter as palavras certas; elas devem estar na ordem certa.'",
                explanation: "O Parser verifica se a sequência de tokens obedece às regras de uma Gramática Livre de Contexto (GLC). Ele transforma uma lista linear em uma estrutura hierárquica (árvore).",
                result: 
`Entrada: id + id * id

Árvore (Hierarquia):
      Soma (+)
     /       \\
   id       Multiplicação (*)
             /         \\
           id           id

O parser define que a multiplicação acontece antes da soma (precedência).`
            },

            // PASSO 2: AS DUAS FILOSOFIAS (TOP-DOWN vs BOTTOM-UP)
            {
                title: "2. As Duas Escolas: Descendente vs. Ascendente",
                theory: "Kaelil (O Visionário) vs. Baruf (O Construtor).",
                explanation: "Existem duas maneiras opostas de construir a árvore:",
                result: 
`1. DESCENDENTE (Top-Down):
   - Filosofia: "Prever e Expandir".
   - Direção: Da Raiz (S) para as Folhas.
   - Como funciona: Começa com o objetivo "Vou criar um Programa". Expande em "Comandos". Expande em "If". Até casar com os tokens.
   - Intuição: O Arquiteto desenhando a planta.

2. ASCENDENTE (Bottom-Up):
   - Filosofia: "Encontrar e Reduzir".
   - Direção: Das Folhas para a Raiz (S).
   - Como funciona: Vê "id". Vê "+". Junta e forma uma "Expressão". Constrói de baixo para cima.
   - Intuição: O Pedreiro empilhando tijolos.`
            },

            // PASSO 3: OS CAMPEÕES (LL vs LR)
            {
                title: "3. Os Algoritmos: LL e LR",
                theory: "As siglas definem a direção da leitura e da derivação.",
                explanation: "Ambos leem da Esquerda para a Direita (O primeiro 'L'). A diferença está em como eles derivam.",
                result: 
`LL (Left-to-right, Leftmost derivation):
   - É DESCENDENTE.
   - Tenta adivinhar qual regra usar olhando o próximo token (Lookahead).
   - Exige gramáticas simples e sem ambiguidade.

LR (Left-to-right, Rightmost derivation reversed):
   - É ASCENDENTE (Shift-Reduce).
   - Empilha tokens até ter certeza de uma regra (Handle).
   - É muito mais poderoso. Aceita gramáticas complexas.`
            },

            // PASSO 4: MANUAL vs AUTOMÁTICO
            {
                title: "4. A Implementação: Por que LL é manual?",
                theory: "J'zargo: 'Se é fácil, faço eu mesmo. Se é difícil, chamo a máquina.'",
                explanation: "Por que escrevemos parsers LL à mão, mas usamos geradores (YACC) para LR?",
                result: 
`LL (Manual - Descida Recursiva):
   - O código reflete a gramática.
   - Regra: S -> A B
   - Código: function S() { A(); B(); }
   - Fácil de escrever, entender e dar mensagens de erro boas.

LR (Automático - Geradores):
   - O código é uma máquina de estados gigante.
   - Tabela com milhares de estados (s4, r2, goto10).
   - Impossível para um humano manter.
   - Usamos ferramentas (YACC, Bison, ANTLR) para gerar o código.`
            },

            // PASSO 5: A RELAÇÃO COM FORMAS NORMAIS
            {
                title: "5. Greibach, Chomsky e a Prática",
                theory: "As Formas Normais são ideais teóricos, não leis absolutas de engenharia.",
                explanation: "Qual a afinidade de cada algoritmo com as formas de Greibach e Chomsky?",
                result: 
`LL e GREIBACH (Afinidade Alta):
   - Greibach (A -> a...) começa sempre com terminal.
   - Isso é o sonho do LL! Ele olha o 'a' e sabe que regra usar.
   - LL precisa eliminar Recursão à Esquerda (que Greibach não tem).

LR e CHOMSKY (Afinidade Baixa):
   - Chomsky (A -> BC) é vital para teoria e algoritmo CYK.
   - Mas o LR prático NÃO GOSTA de Chomsky.
   - LR prefere a gramática natural para manter a árvore legível.
   - LR lida bem com vazio e recursão, coisas que Chomsky remove.`
            },

            // PASSO 6: O FLUXO DE DADOS (PILHA)
            {
                title: "6. A Alma da Máquina (A Pilha)",
                theory: "A diferença fundamental no uso da memória.",
                explanation: "O que cada parser guarda na sua pilha?",
                result: 
`Pilha LL (O Futuro):
   - Guarda o que ESPERAMOS ver.
   - Ex: [S, A, B, $]
   - "Ainda preciso achar um A e depois um B."

Pilha LR (O Passado):
   - Guarda o que JÁ VIMOS e PROCESSAMOS.
   - Ex: [id, +, E, $]
   - "Já vi um id e um mais, e reduzi um E anterior."`
            }
        ]
    },
    //MODULO 3
    {
    
        title: "Módulo 3: Análise Semântica (O Juiz da Verdade)",
        initialGrammar: 
`A fase onde a estrutura encontra o significado.
Onde o compilador deixa de verificar a forma e passa a verificar a coerência.

Entrada: Árvore Sintática Abstrata (AST)
Ferramentas: Tabela de Símbolos, Gramática de Atributos (SDT).
Saída: Árvore Decorada (Anotada) ou Código Intermediário.`,
        steps: [
            // PASSO 1: A MISSÃO
            {
                title: "1. A Missão: Coerência sobre Estrutura",
                theory: "Uma frase pode ser sintaticamente perfeita, mas semanticamente absurda. A Sintaxe vê a ordem dos tokens; a Semântica vê a lógica dos tipos e contextos.",
                explanation: "Kaelil: 'O analisador sintático aceita a frase 'O quadrado bebeu a cor azul', pois segue a estrutura Artigo-Substantivo-Verbo. O analisador semântico a rejeita, pois 'quadrados' não bebem e 'cores' não são bebidas.'",
                result: 
`CÓDIGO: boolean x = 10 + "texto";

1. O GUARDA (Sintaxe/Parser):
   "Vejo <TIPO> <ID> '=' <NUM> '+' <STRING>. A ordem está correta conforme a gramática. Pode passar."

2. O JUIZ (Semântica):
   "Pare! Tentei somar um NÚMERO com um TEXTO. A operação '+' não suporta esses operandos. E o resultado dessa soma impossível não cabe numa variável BOOLEANA. Condenado!"`
            },

            // PASSO 2: A TABELA DE SÍMBOLOS
            {
                title: "2. A Memória do Mundo (Tabela de Símbolos)",
                theory: "O compilador precisa lembrar de tudo o que você declarou. A Tabela de Símbolos é um banco de dados dinâmico que armazena metadados sobre cada identificador.",
                explanation: "J'zargo: 'Se você chama uma variável de 'vida', J'zargo anota no Livro: nome, tipo, onde ela mora e quanto vale. Se você tentar usar 'mana' e não estiver no Livro, J'zargo não sabe o que é.'",
                result: 
`ENTRADA: 
const int MAX = 100;
float calcular(int a) { ... }

O LIVRO DOS NOMES (Tabela de Símbolos):
---------------------------------------------------------
| LEXEMA   | CATEGORIA | TIPO   | ESCOPO | ATRIBUTOS    |
|----------|-----------|--------|--------|--------------|
| MAX      | Constante | int    | global | valor: 100   |
| calcular | Função    | float  | global | params: [int]|
| a        | Parâmetro | int    | calcular| offset: 0   |
---------------------------------------------------------`
            },

            // PASSO 3: VERIFICAÇÃO DE TIPOS (TYPE CHECKING)
            {
                title: "3. O Sistema de Tipos (Type Checking)",
                theory: "A tarefa mais pesada da semântica. Verificar se as operações são permitidas para os tipos de dados envolvidos e se os valores atribuídos são compatíveis.",
                explanation: "Erandur: 'É a imposição de restrições. A árvore é percorrida (geralmente de baixo para cima), e cada nó calcula seu tipo baseando-se nos filhos.'",
                result: 
`EXPRESSÃO: x = y + 5.5
(Sabendo que x é int e y é int)

ANÁLISE NA ÁRVORE (Bottom-Up):
1. Nó 'y': Consulta tabela -> TIPO: INT.
2. Nó '5.5': Constante -> TIPO: FLOAT.
3. Nó '+': Recebe (INT, FLOAT).
   - Regra: Int promove para Float.
   - Resultado do '+': TIPO: FLOAT.
4. Nó '=': Recebe (x:INT, expr:FLOAT).
   - Erro: Perda de precisão! Não pode guardar Float em Int sem cast explícito.`
            },

            // PASSO 4: OS PECADOS SEMÂNTICOS
            {
                title: "4. Os Três Pecados Capitais",
                theory: "Existem três categorias principais de erros que travam a análise semântica. Eles protegem o programa de comportamentos indefinidos.",
                explanation: "Seu código pode estar bonito, mas se cometer um desses erros, ele não nasce.",
                result: 
`1. NÃO DECLARADO (Undeclared):
   - Código: ataque = 10; (sem declarar 'ataque' antes)
   - O Juiz: "Quem é 'ataque'? Não está no Livro."

2. TIPO INCOMPATÍVEL (Type Mismatch):
   - Código: if ("texto") { ... }
   - O Juiz: "A condição do IF exige BOOLEAN, recebeu STRING."

3. MULTIPLA DECLARAÇÃO (Redeclaration):
   - Código: int x = 1; int x = 2;
   - O Juiz: "'x' já existe neste contexto. Não pode haver dois com o mesmo nome."`
            },

            // PASSO 5: O ESCOPO (SCOPE)
            {
                title: "5. A Lei do Contexto (Escopo)",
                theory: "O mesmo nome pode significar coisas diferentes em lugares diferentes. O compilador usa uma pilha de tabelas para gerenciar a visibilidade.",
                explanation: "J'zargo: 'O que acontece na caverna, fica na caverna. Uma variável criada dentro de um bloco { } é destruída quando o bloco termina.'",
                result: 
`CÓDIGO:
1. int a = 0;        // 'a' Global
2. void func() {
3.    int a = 5;     // 'a' Local (Sombra do Global)
4.    print(a);      // Usa o Local (5)
5. }
6. print(a);         // Usa o Global (0)

MECANISMO DA PILHA:
- Linha 2: Empilha nova Tabela (Escopo Função).
- Linha 3: Insere 'a' na tabela do topo.
- Linha 4: Busca 'a'. Acha no topo.
- Linha 5: Desempilha tabela (O 'a' local morre).
- Linha 6: Busca 'a'. Acha na tabela global (restante).`
            },

            // PASSO 6: GRAMÁTICA DE ATRIBUTOS (A DECORAÇÃO)
            {
                title: "6. Decorando a Árvore (Gramática de Atributos)",
                theory: "Como a informação viaja pela árvore sintática? Nós anexamos 'atributos' (valores) aos nós da árvore. As regras semânticas definem como esses valores fluem.",
                explanation: "Erandur: 'A informação flui em duas direções: SINTETIZADA (sobe dos filhos para o pai) ou HERDADA (desce do pai/irmãos para o filho).'",
                result: 
`ATRIBUTOS SINTETIZADOS (Sobe ↑):
- Usado para: Calcular valores, determinar tipos de expressões.
- Regra: E -> E1 + T
- Ação: E.tipo = verificar(E1.tipo, T.tipo)
- (O pai 'E' descobre o que é olhando para os filhos).

ATRIBUTOS HERDADOS (Desce ↓):
- Usado para: Distribuir contexto (como o tipo em uma declaração).
- Regra: D -> T L
- Ação: L.tipoIn = T.tipo
- (O nó de tipo 'T' passa a informação para a lista de variáveis 'L').`
            }
        ]
    },
    //MODULO 4
    {
        id: 4,
        title: "Módulo 4: As Formas da Lei",
        initialGrammar: 
`Antes de processar uma linguagem, precisamos padronizá-la.
Aqui estudamos a escrita das leis (BNF/EBNF) e as formas normais que otimizam os algoritmos.

Conteúdo:
1. BNF e EBNF (Notação)
2. Forma Normal de Chomsky (FNC)
3. Forma Normal de Greibach (FNG)`,
        steps: [
            // PASSO 1: DEFINIÇÕES BNF E EBNF (ATUALIZADO)
            {
                title: "1. A Lei Escrita: O que são BNF e EBNF?",
                theory: "Antes de processar as regras, precisamos de uma metassintaxe para escrevê-las.",
                explanation: "Erandur explica as definições fundamentais de como as gramáticas são registradas:",
                result: 
`1. BNF (Backus-Naur Form):
- O Pergaminho Original. purista e minimalista.
- Símbolos: < > para não-terminais, ::= para definição, | para escolha.
- O Segredo: Usa RECURSÃO para fazer listas e repetições.

2. EBNF (Extended Backus-Naur Form):
- A Evolução. Adiciona 'açúcar sintático' para facilitar a leitura.
- Símbolos Extras: { } para repetição, [ ] para opcional.
- O Segredo: Usa ITERAÇÃO em vez de recursão.`
            },

            // PASSO 2: RECURSÃO VS ITERAÇÃO (ATUALIZADO)
            {
                title: "2. O Duelo: Recursão vs. Iteração",
                theory: "A principal diferença é como lidamos com repetições nas notações.",
                explanation: "Veja como a EBNF simplifica a escrita de um número inteiro (sequência de dígitos):",
                result: 
`OBJETIVO: Definir "Um dígito, seguido de outros dígitos".

EM BNF (Recursiva):
<inteiro> ::= <digito> | <digito> <inteiro>

EM EBNF (Iterativa):
<inteiro> ::= <digito> { <digito> }

CONCLUSÃO:
BNF é a base teórica; EBNF é a ferramenta prática dos engenheiros.`
            },

            // PASSO 3: CHOMSKY (MANTIDO)
            {
                title: "3. Forma Normal de Chomsky (O Binário)",
                theory: "Uma gramática está na FNC se todas as suas regras seguem estritamente dois formatos: A -> BC ou A -> a.",
                explanation: "Kaelil: 'Chomsky ama a simetria binária. Ele não gosta de regras vazias (ε) nem de regras unitárias (A->B).'",
                result: 
`Regras Permitidas na FNC:
1. A -> B C   (Dois Não-Terminais)
2. A -> a     (Um Terminal)

Para que serve?
- Permite o algoritmo CYK (Parsing eficiente).
- Transforma a derivação em uma Árvore Binária perfeita.`
            },

            // PASSO 4: GREIBACH (MANTIDO)
            {
                title: "4. Forma Normal de Greibach (A Preditiva)",
                theory: "Uma gramática está na FNG se todas as regras começam com um Terminal: A -> a V*.",
                explanation: "J'zargo: 'Greibach quer ver a ação (o terminal) logo no começo da regra. Isso ajuda a saber qual caminho tomar imediatamente.'",
                result: 
`Regras Permitidas na FNG:
1. A -> a       (Apenas um terminal)
2. A -> a B C   (Terminal seguido de variáveis)

Para que serve?
- Elimina Recursão à Esquerda.
- Ideal para Parsers Descendentes (LL), pois o terminal inicial serve como guia.`
            },

            // PASSO 5: COMPARAÇÃO (MANTIDO)
            {
                title: "5. O Grande Duelo: Chomsky vs Greibach",
                theory: "Qual forma usar? Depende da sua estratégia de parsing.",
                explanation: "Chomsky é para quem constrói de baixo para cima (Ascendente). Greibach é para quem prevê de cima para baixo (Descendente).",
                result: 
`RESUMO DA BATALHA:

CHOMSKY (FNC):
- Estrutura: Binária.
- Aliado: Algoritmo CYK (Ascendente).
- Fraqueza: Árvores muito profundas.

GREIBACH (FNG):
- Estrutura: Terminal na frente.
- Aliado: Parsers LL (Descendente).
- Fraqueza: Conversão manual complexa.`
            }
        ]
    }
]