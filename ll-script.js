/**
 * Módulo: Análise Sintática Descendente (LL)
 * Arquivo: ll-script.js
 * Conteúdo: Questão 1 - Expressões Lógicas (Refatorado)
 */

const llQuestions = [
    {
        title: "O Cânone das Expressões Lógicas",
        initialGrammar: 
`G = ({E, E', T, T', F}, {v, &, ~, id, (, )}, P, E)

1. E  -> T E'
2. E' -> v T E' | ε
3. T  -> F T'
4. T' -> & F T' | ε
5. F  -> ~ F | id`,
        steps: [
            // ----------------------------------------------------------------
            // ETAPA 1: FIRST
            // ----------------------------------------------------------------
            {
                title: "Etapa 1: O Cálculo de FIRST (O Início)",
                theory: "FIRST(X) é o conjunto de terminais que começam a derivação de X. Se X pode sumir (ε), incluímos ε no conjunto.",
                explanation: "Analisamos de baixo para cima. F é a base. T depende de F. E depende de T.",
                result: 
`1. FIRST(F)  = { ~, id } 
   (F começa diretamente com '~' ou 'id')

2. FIRST(T') = { &, ε } 
   (T' começa com '&' ou é vazio)

3. FIRST(T)  = { ~, id } 
   (T -> F T'. Como F começa com {~, id} e F não tem ε, T herda F)

4. FIRST(E') = { v, ε } 
   (E' começa com 'v' ou é vazio)

5. FIRST(E)  = { ~, id } 
   (E -> T E'. Como T começa com {~, id} e T não tem ε, E herda T)`
            },

            // ----------------------------------------------------------------
            // ETAPA 2: FOLLOW
            // ----------------------------------------------------------------
            {
                title: "Etapa 2: O Cálculo de FOLLOW (O Depois)",
                theory: "FOLLOW(X) são os terminais que aparecem imediatamente à direita de X. Se X for o último da regra (ou quem o segue sumir), ele herda do Pai.",
                explanation: "Foque nos pais E' e T'. Eles são anuláveis (tem ε). Isso faz com que T e F herdem o contexto de seus pais.",
                result: 
`1. FOLLOW(E)  = { $ } 
   (Símbolo inicial. Se houvesse ')' na gramática, entraria aqui também)

2. FOLLOW(E') = { $ } 
   (E' é o final de 'E -> T E''. Herda de E)

3. FOLLOW(T)  = { v, $ } 
   (Em 'E -> T E'', T é seguido por E'.
    - Pega FIRST(E') = { v } (exceto ε)
    - Como E' tem ε, T herda FOLLOW(E) = { $ })

4. FOLLOW(T') = { v, $ } 
   (T' é o final de 'T -> F T''. Herda de T)

5. FOLLOW(F)  = { &, v, $ } 
   (Em 'T -> F T'', F é seguido por T'.
    - Pega FIRST(T') = { & } (exceto ε)
    - Como T' tem ε, F herda FOLLOW(T) = { v, $ })`
            },

            // ----------------------------------------------------------------
            // ETAPA 3: A TABELA
            // ----------------------------------------------------------------
            {
                title: "Etapa 3: O Oráculo de Pedra (A Tabela)",
                theory: "Linhas = Não-Terminais. Colunas = Terminais. Cruzamos a regra baseada no FIRST. Se FIRST tem ε, usamos o FOLLOW.",
                explanation: "Observe as células [E', $] e [T', v]. Elas contêm as produções vazias (ε) porque esses terminais estão no FOLLOW.",
                result: 
`      | id      | v          | &          | ~       | $
---------------------------------------------------------
E     | E->TE'  |            |            | E->TE'  |
E'    |         | E'->vTE'   |            |         | E'->ε
T     | T->FT'  |            |            | T->FT'  |
T'    |         | T'->ε      | T'->&FT'   |         | T'->ε
F     | F->id   |            |            | F->~F   |`
            },

            // ----------------------------------------------------------------
            // ETAPA 4: A ANÁLISE
            // ----------------------------------------------------------------
            {
                title: "Etapa 4: O Autômato Vidente (Parsing)",
                theory: "Visualização da Pilha: O TOPO está à ESQUERDA. A regra 'E -> T E'' é empilhada como 'T E''.",
                explanation: "Sentença: id v id & id. O autômato expande para a esquerda e casa com a entrada.",
                result: 
`PILHA (Topo Esq)   ENTRADA          AÇÃO / REGRA
E $                id v id & id $   E  -> T E'
T E' $             id v id & id $   T  -> F T'
F T' E' $          id v id & id $   F  -> id
id T' E' $         id v id & id $   Match (id)
T' E' $            v id & id $      T' -> ε (Pela tabela [T', v])
E' $               v id & id $      E' -> v T E'
v T E' $           v id & id $      Match (v)
T E' $             id & id $        T  -> F T'
F T' E' $          id & id $        F  -> id
id T' E' $         id & id $        Match (id)
T' E' $            & id $           T' -> & F T'
& F T' E' $        & id $           Match (&)
F T' E' $          id $             F  -> id
id T' E' $         id $             Match (id)
T' E' $            $                T' -> ε (Pela tabela [T', $])
E' $               $                E' -> ε (Pela tabela [E', $])
$                  $                ACEITO`
            }
        ]
    },
    {
        title: "O Cânone da Fundação Simples",
        initialGrammar: 
`1. S -> A B
2. A -> d A | e
3. B -> f B | g`,
        steps: [
            {
                title: "Etapa 1: O Cálculo de FIRST (O Início)",
                theory: "Analisamos os terminais iniciais. Como não há epsilon (vazio), o cálculo é direto.",
                explanation: "Para S -> A B, olhamos para A. Como A não gera vazio, o início de S é apenas o início de A.",
                result: 
`1. FIRST(A) = { d, e }

2. FIRST(B) = { f, g }

3. FIRST(S) = { d, e }`
            },
            {
                title: "Etapa 2: O Cálculo de FOLLOW (O Debate do Guarda-Costas)",
                theory: "Em S -> A B, A é seguido por B. A herda FOLLOW(S) apenas se B puder desaparecer.",
                explanation: "Como B é sólido (não gera ε), ele bloqueia a visão de A. A vê apenas o início de B. B, estando no final, vê o que segue S.",
                result: 
`1. FOLLOW(S) = { $ }

2. FOLLOW(A) = { f, g }
   (FIRST(B) é {f, g}. B não é anulável, então NÃO herda $)

3. FOLLOW(B) = { $ }
   (Herda de S)`
            },
            {
                title: "Etapa 3: O Oráculo de Pedra (A Tabela)",
                theory: "Sem produções vazias, não usamos o FOLLOW para preencher a tabela (Decreto do Vazio não se aplica).",
                explanation: "Preenchimento direto pelo FIRST. Cada célula contém uma única regra.",
                result: 
`      | d       | e       | f       | g       | $
---------------------------------------------------
S     | S->AB   | S->AB   |         |         |
A     | A->dA   | A->e    |         |         |
B     |         |         | B->fB   | B->g    |`
            },
            {
                title: "Etapa 4: O Autômato Vidente (Parsing)",
                theory: "Análise de 'ddefg'. Pilha cresce para a esquerda (Topo).",
                explanation: "Note a transição de A para B. Assim que A consome 'e' e termina, B (que estava esperando na pilha) assume.",
                result: 
`PILHA (Topo Esq)   ENTRADA      AÇÃO / REGRA
S $                ddefg $      S -> A B
A B $              ddefg $      A -> d A
d A B $            ddefg $      Match d
A B $              defg $       A -> d A
d A B $            defg $       Match d
A B $              efg $        A -> e
e B $              efg $        Match e
B $                fg $         B -> f B
f B $              fg $         Match f
B $                g $          B -> g
g $                g $          Match g
$                  $            ACEITO`
            }
        ]
    },
    {
        title: "O Cânone da Lista e do Colchete",
        initialGrammar: 
`1. L  -> [ E ]
2. E  -> T E'
3. E' -> , T E' | ε
4. T  -> id`,
        steps: [
            {
                title: "Etapa 1: O Cálculo de FIRST (O Início)",
                theory: "Identificamos os terminais que iniciam cada estrutura. Atenção ao E', que pode começar com ',' ou desaparecer.",
                explanation: "T começa com 'id'. E' começa com ',' ou vazio. E começa com T, logo 'id'. L começa com '['.",
                result: 
`1. FIRST(T)  = { id }

2. FIRST(E') = { , , ε }

3. FIRST(E)  = { id }

4. FIRST(L)  = { [ }`
            },
            {
                title: "Etapa 2: O Cálculo de FOLLOW (O Limite)",
                theory: "O FOLLOW determina quando podemos aplicar o vazio. Aqui, o fechamento ']' é a chave.",
                explanation: "Como E' pode sumir, quem estava atrás dele (o ']') agora fica exposto a quem estava antes (T).",
                result: 
`1. FOLLOW(L)  = { $ }

2. FOLLOW(E)  = { ] }
   (Em L -> [ E ], E é seguido por ']')

3. FOLLOW(E') = { ] }
   (Herda de E)

4. FOLLOW(T)  = { , , ] }
   (Pega FIRST(E') exceto ε. Como E' tem ε, pega FOLLOW(E'))`
            },
            {
                title: "Etapa 3: O Oráculo de Pedra (A Tabela)",
                theory: "O Decreto do Vazio em ação. A regra E' -> ε vai na coluna ']', pois ']' está no FOLLOW de E'.",
                explanation: "A tabela diz: Se ver vírgula, continue a lista. Se ver ']', pare (aplique vazio).",
                result: 
`      | [       | id      | ,          | ]       | $
------------------------------------------------------
L     | L->[E]  |         |            |         |
E     |         | E->TE'  |            |         |
E'    |         |         | E'->,TE'   | E'->ε   |
T     |         | T->id   |            |         |`
            },
            {
                title: "Etapa 4: O Autômato Vidente (Parsing)",
                theory: "Analisando '[id,id,id,id]'. A pilha cresce para a esquerda.",
                explanation: "O autômato consome as vírgulas ciclicamente. Na fase final, ao ver ']', ele usa E' -> ε para limpar a pilha e fechar o colchete.",
                result: 
`PILHA (Topo Esq)   ENTRADA          AÇÃO / REGRA
L $                [id,id,id,id] $  L  -> [ E ]
[ E ] $            [id,id,id,id] $  Match [
E ] $              id,id,id,id] $   E  -> T E'
T E' ] $           id,id,id,id] $   T  -> id
id E' ] $          id,id,id,id] $   Match id
E' ] $             ,id,id,id] $     E' -> , T E'
, T E' ] $         ,id,id,id] $     Match ,
T E' ] $           id,id,id] $      T  -> id
id E' ] $          id,id,id] $      Match id
E' ] $             ,id,id] $        E' -> , T E'
, T E' ] $         ,id,id] $        Match ,
T E' ] $           id,id] $         T  -> id
id E' ] $          id,id] $         Match id
E' ] $             ,id] $           E' -> , T E'
, T E' ] $         ,id] $           Match ,
T E' ] $           id] $            T  -> id
id E' ] $          id] $            Match id
E' ] $             ] $              E' -> ε
] $                ] $              Match ]
$                  $                ACEITO`
            }
        ]
    },
    {
        title: "O Cânone da Sequência Pura",
        initialGrammar: 
`1. S -> M N
2. M -> o M | p
3. N -> q N | r`,
        steps: [
            {
                title: "Etapa 1: O Cálculo de FIRST (O Início)",
                theory: "Cálculo direto sem produções vazias. O início de S é determinado inteiramente pelo início de M.",
                explanation: "M começa com 'o' ou 'p'. N começa com 'q' ou 'r'. S começa com M, logo herda {o,p}.",
                result: 
`1. FIRST(M) = { o, p }

2. FIRST(N) = { q, r }

3. FIRST(S) = { o, p }`
            },
            {
                title: "Etapa 2: O Cálculo de FOLLOW (O Vizinho)",
                theory: "Teste da Lei 2 (Vizinhança). Em S -> M N, quem segue M? É o início de N.",
                explanation: "M é seguido por N. N não é transparente, então M vê apenas o início de N. N está no fim, vê o fim de S.",
                result: 
`1. FOLLOW(S) = { $ }

2. FOLLOW(M) = { q, r }
   (Pega FIRST(N))

3. FOLLOW(N) = { $ }
   (Herda de S)`
            },
            {
                title: "Etapa 3: O Oráculo de Pedra (A Tabela)",
                theory: "Tabela Pura. O FOLLOW não é consultado para preencher células, pois não há regras epsilon.",
                explanation: "Cada entrada é determinada exclusivamente pelo FIRST da regra.",
                result: 
`      | o       | p       | q       | r       | $
---------------------------------------------------
S     | S->MN   | S->MN   |         |         |
M     | M->oM   | M->p    |         |         |
N     |         |         | N->qN   | N->r    |`
            },
            {
                title: "Etapa 4: O Autômato Vidente (Parsing)",
                theory: "Analisando 'oopqr'. O autômato deve resolver a recursão de M antes de tocar em N.",
                explanation: "Acompanhe a pilha crescendo para a esquerda. O N fica esperando no fundo enquanto o M é resolvido.",
                result: 
`PILHA (Topo Esq)   ENTRADA      AÇÃO / REGRA
S $                oopqr $      S -> M N
M N $              oopqr $      M -> o M
o M N $            oopqr $      Match o
M N $              opqr $       M -> o M
o M N $            opqr $       Match o
M N $              pqr $        M -> p
p N $              pqr $        Match p
N $                qr $         N -> q N
q N $              qr $         Match q
N $                r $          N -> r
r $                r $          Match r
$                  $            ACEITO`
            }
        ]
    },
    {
        title: "O Cânone da Decisão e do Erro",
        initialGrammar: 
`Uma gramática para o fluxo de controle if-then-else.
Demonstra a resolução de dependência circular no Follow e detecção de erro.

1. S  -> if E then S S' | other
2. S' -> else S | ε
3. E  -> id`,
        steps: [
            {
                title: "Etapa 1: O Cálculo de FIRST (O Início)",
                theory: "Identificamos as palavras-chave que iniciam os comandos. FIRST(S') inclui ε, indicando que o 'else' é opcional.",
                explanation: "S começa com 'if' ou 'other'. S' começa com 'else' ou vazio. E começa com 'id'.",
                result: 
`1. FIRST(E)  = { id }

2. FIRST(S') = { else, ε }

3. FIRST(S)  = { if, other }`
            },
            {
                title: "Etapa 2: O Cálculo de FOLLOW (O Elo Circular)",
                theory: "Dependência Circular: S termina com S', e S' termina com S (no else). Eles herdam o contexto um do outro.",
                explanation: "Como ambos estão no final de suas estruturas e se referenciam, seus conjuntos FOLLOW se estabilizam no contexto externo (o fim da entrada $).",
                result: 
`1. FOLLOW(S)  = { $ }
   (Símbolo inicial. Também herda de S' em S'->else S)

2. FOLLOW(S') = { $ }
   (S' está no fim de S->if...S S'. Herda FOLLOW(S) = {$})

3. FOLLOW(E)  = { then }
   (Em S->if E then..., E é seguido por 'then')`
            },
            {
                title: "Etapa 3: O Oráculo de Pedra (A Tabela)",
                theory: "A resolução da ambiguidade. A regra S'->ε é colocada APENAS na coluna $, pois apenas $ está no FOLLOW(S').",
                explanation: "Se o autômato ver 'else', ele usa S'->else S. Se ver fim de arquivo, usa S'->ε. Isso resolve o 'else pendente'.",
                result: 
`      | if              | then | else        | id     | other      | $
-----------------------------------------------------------------------
S     | S->if E then SS'|      |             |        | S->other   |
S'    |                 |      | S'->else S  |        |            | S'->ε
E     |                 |      |             | E->id  |            |`
            },
            {
                title: "Etapa 4: O Autômato Vidente (ERRO)",
                theory: "Teste de Robustez: 'if id then if then...'. O autômato deve falhar ao encontrar uma estrutura incompleta.",
                explanation: "Na linha 8, o autômato espera uma Expressão (E) para o segundo 'if', mas encontra 'then'. A tabela está vazia. O erro é detectado.",
                result: 
`PILHA (Topo Esq)      ENTRADA               AÇÃO / REGRA
S $                   if id then if then $  S -> if E then S S'
if E then S S' $      if id then if then $  Match if
E then S S' $         id then if then $     E -> id
id then S S' $        id then if then $     Match id
then S S' $           then if then $        Match then
S S' $                if then $             S -> if E then S S'
if E then S S' S' $   if then $             Match if
E then S S' S' $      then $                ERRO!
                                            (Tabela[E, then] é vazia)`
            }
        ]
    },
    // ========================================================================
    // QUESTÃO 6: O CÂNONE DA CADEIA DE DEPENDÊNCIA
    // ========================================================================
    {
        title: "O Cânone da Cadeia de Dependência",
        initialGrammar: 
`Uma gramática complexa com dependências cruzadas entre os não-terminais.
Exige uma ordem estratégica de resolução do Follow.

1. S -> X Y Z
2. X -> a X b | ε
3. Y -> c Y Z c X | d
4. Z -> e Z Y e | f`,
        steps: [
            {
                title: "Etapa 1: O Cálculo de FIRST (A Transparência)",
                theory: "A Lei da Transparência em S -> XYZ. Como X gera ε, precisamos olhar para Y. Como Y é sólido, paramos antes de Z.",
                explanation: "X começa com 'a' ou vazio. Y começa com 'c' ou 'd'. S começa com X, e se X sumir, começa com Y.",
                result: 
`1. FIRST(X) = { a, ε }

2. FIRST(Y) = { c, d }

3. FIRST(Z) = { e, f }

4. FIRST(S) = { a, c, d }
   (União de FIRST(X)-ε e FIRST(Y))`
            },
            {
                title: "Etapa 2: O Cálculo de FOLLOW (A Ordem Estratégica)",
                theory: "Dependências: X depende de Y (pois Y->...X), mas Y não depende de X. Resolvemos Y primeiro para evitar bloqueio.",
                explanation: "FOLLOW(X) é o mais rico: ganha 'b' (dele mesmo), ganha FIRST(Y) (do S->XYZ) e herda FOLLOW(Y) (de Y->...X).",
                result: 
`1. FOLLOW(S) = { $ }

2. FOLLOW(Y) = { e, f }
   (Em S->XYZ, seguido por FIRST(Z). Em Z->eZYe, seguido por 'e')

3. FOLLOW(Z) = { $, c, d }
   (Em S->XYZ, herda de S. Em Y->cY... seguido por 'c'. Em Z->eZ... seguido por FIRST(Y))

4. FOLLOW(X) = { b, c, d, e, f }
   (Em X->aXb, seguido por 'b'. Em S->XYZ, seguido por FIRST(Y)={c,d}.
    Em Y->...X, herda FOLLOW(Y)={e,f})`
            },
            {
                title: "Etapa 3: O Oráculo de Pedra (A Tabela)",
                theory: "O conjunto FOLLOW(X) espalha a regra X->ε por quase todas as colunas. X é altamente anulável.",
                explanation: "Observe a linha do X. Se o autômato ver b, c, d, e, ou f, ele pode decidir esvaziar o X.",
                result: 
`      | a      | b     | c       | d      | e       | f      | $
------------------------------------------------------------------
S     | S->XYZ |       | S->XYZ  | S->XYZ |         |        |
X     | X->aXb | X->ε  | X->ε    | X->ε   | X->ε    | X->ε   |
Y     |        |       | Y->cY...| Y->d   |         |        |
Z     |        |       |         |        | Z->eZYe | Z->f   |`
            },
            {
                title: "Etapa 4: O Autômato Vidente (Parsing)",
                theory: "Analisando 'abdf'. Teste de anulação de X seguida de consumo de Y e Z.",
                explanation: "O autômato expande X, consome 'a', depois esvazia o X interno ao ver 'b', permitindo que o 'b' da regra feche o par.",
                result: 
`PILHA (Topo Esq)   ENTRADA      AÇÃO / REGRA
S $                abdf $       S -> X Y Z
X Y Z $            abdf $       X -> a X b
a X b Y Z $        abdf $       Match a
X b Y Z $          bdf $        X -> ε (Olhando 'b')
b Y Z $            bdf $        Match b
Y Z $              df $         Y -> d
d Z $              df $         Match d
Z $                f $          Z -> f
f $                f $          Match f
$                  $            ACEITO`
            }
        ]
    },
    // ========================================================================
    // QUESTÃO 7: O CÂNONE DA ILUSÃO DE ESCOLHA
    // ========================================================================
    {
        title: "O Cânone da Ilusão de Escolha",
        initialGrammar: 
`Uma gramática onde múltiplas opções levam ao mesmo início.
Demonstra a união de conjuntos e a simplificação.

1. S -> A B
2. A -> c | ε
3. B -> cbB | ca`,
        steps: [
            {
                title: "Etapa 1: O Cálculo de FIRST (A União)",
                theory: "FIRST é a união dos inícios de todas as produções alternativas. Aqui, B tem duas regras, mas ambas começam com 'c'.",
                explanation: "Para B, unimos {c} com {c}, resultando em {c}. Para S, pegamos FIRST(A). Como A tem ε, também pegamos FIRST(B). Ambos são 'c'.",
                result: 
`1. FIRST(A) = { c, ε }

2. FIRST(B) = { c }
   (cbB começa com 'c'. ca começa com 'c'.)

3. FIRST(S) = { c }
   (União de FIRST(A)-ε e FIRST(B). {c} U {c} = {c})`
            },
            {
                title: "Etapa 2: O Cálculo de FOLLOW (A Simplicidade)",
                theory: "Cálculo direto. A é seguido por B. B está no fim de S.",
                explanation: "Follow(A) recebe First(B) = {c}. Follow(B) recebe Follow(S) = {$}.",
                result: 
`1. FOLLOW(S) = { $ }

2. FOLLOW(A) = { c }
   (Seguido por B. First(B) é {c}. B não é anulável.)

3. FOLLOW(B) = { $ }
   (Final de S. Herda de S.)`
            },
        ]
    }
]; 
