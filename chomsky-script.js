// ============================================================================
// PARTE I: O TOMO DE DADOS (MÓDULO CHOMSKY)
// ============================================================================

const chomskyQuestions = [
    {
        id: 1,
        title: "Enigma I: A Fundamentação",
        initialGrammar: "S → aAd | A\nA → Bc | ε\nB → Ac | a",
        steps: [
            {
                title: "Etapa 1: Eliminação de Produções Vazias (ε)",
                theory: "O Vazio (ε) cria instabilidade na análise sintática (CYK). Identificamos quem desaparece e propagamos as consequências para todas as regras onde esses símbolos aparecem.",
                explanation: "Identificamos que A é anulável (A → ε). S também se torna anulável pois S → A. \nPropagamos o desaparecimento de A:\n- Em 'S → aAd', se A some, resta 'ad'.\n- Em 'B → Ac', se A some, resta 'c'.\nRemovemos A → ε.",
                result: "S → aAd | ad | A | ε\nA → Bc\nB → Ac | c | a"
            },
            {
                title: "Etapa 2: Eliminação de Produções Unitárias",
                theory: "Regras da forma A → B são redirecionamentos que consomem processamento sem gerar terminais. Devemos copiar o destino diretamente para a origem.",
                explanation: "Temos S → A. Substituímos 'A' pelas suas produções (Bc). Agora S gera diretamente o que A gerava.",
                result: "S → aAd | ad | Bc | ε\nA → Bc\nB → Ac | c | a"
            },
            {
                title: "Etapa 3: Isolação de Terminais",
                theory: "Na FNC, uma regra deve gerar dois não-terminais (A → BC) OU um terminal (A → a). Misturas como 'aAd' são proibidas. Isolamos terminais em variáveis exclusivas.",
                explanation: "Criamos Ca → a, Cc → c, Cd → d.\nSubstituímos nas regras mistas:\n- S → aAd vira S → Ca A Cd\n- S → ad vira S → Ca Cd\n- B → Ac vira B → A Cc\n(Nota: B → a já está correto e não muda).",
                result: "S → Ca A Cd | Ca Cd | B Cc | ε\nA → B Cc\nB → A Cc | Cc | a\nCa → a\nCc → c\nCd → d"
            },
            {
                title: "Etapa 4: Binarização (Quebra de Cadeias)",
                theory: "O algoritmo exige árvores binárias. Regras com 3 ou mais variáveis devem ser quebradas em escada. A → BCD vira A → BE e E → CD.",
                explanation: "A regra 'S → Ca A Cd' tem 3 variáveis. Criamos uma auxiliar D1 → A Cd.\nAssim, a regra original se torna S → Ca D1.",
                result: "S → Ca D1 | Ca Cd | B Cc | ε\nA → B Cc\nB → A Cc | Cc | a\nD1 → A Cd\nCa → a\nCc → c\nCd → d"
            }
        ]
    },
    {
        id: 2,
        title: "Enigma II: A Anulação em Massa (Corrigido)",
        initialGrammar: "S → A | B | ABS\nA → aA | ε\nB → aBAb | ε",
        steps: [
            {
                title: "Etapa 1: Purificação do Vazio (Ritual Agressivo)",
                theory: "Com A, B e S anuláveis, a regra S->ABS gera uma explosão combinatória. Devemos listar todas as permutações onde um ou mais símbolos desaparecem.",
                explanation: "1. A e B são anuláveis. S é anulável (pois S->A).\n2. Expandindo S → ABS:\n   - Se A some: BS\n   - Se B some: AS\n   - Se S some: AB\n   - Se A e B somem: S\n   - Se A e S somem: B\n   - Se B e S somem: A\n   - Se todos somem: ε\n3. Expandindo B → aBAb:\n   - Se B some: aAb\n   - Se A some: aBb\n   - Se ambos somem: ab",
                result: "S → A | B | ABS | BS | AS | AB | S | ε\nA → aA | a\nB → aBAb | aAb | aBb | ab"
            },
            {
                title: "Etapa 2: Eliminação de Unitárias",
                theory: "O General S deve assumir o comando. Removemos S->S e fazemos S herdar as regras de A e B.",
                explanation: "1. Removemos S → S.\n2. Substituímos S → A por {aA, a}.\n3. Substituímos S → B por {aBAb, aAb, aBb, ab}.\n\nAgora S possui suas regras próprias (ABS, BS...) mais as herdadas.",
                result: "S → ABS | BS | AS | AB | aA | a | aBAb | aAb | aBb | ab | ε\nA → aA | a\nB → aBAb | aAb | aBb | ab"
            },
            {
                title: "Etapa 3: Isolação de Terminais",
                theory: "Separamos a matéria (terminais) da estrutura (variáveis). 'a' vira Ca, 'b' vira Cb.",
                explanation: "Criamos Ca -> a e Cb -> b. Substituímos em todas as regras mistas de S e B:\n\n- aA vira Ca A\n- aBAb vira Ca B A Cb  <-- (Correção Crítica: O A é preservado)\n- aAb vira Ca A Cb\n- aBb vira Ca B Cb\n- ab vira Ca Cb",
                result: "S → A B S | B S | A S | A B | Ca A | a | Ca B A Cb | Ca A Cb | Ca B Cb | Ca Cb | ε\nA → Ca A | a\nB → Ca B A Cb | Ca A Cb | Ca B Cb | Ca Cb\nCa → a\nCb → b"
            },
            {
                title: "Etapa 4: Binarização (Final)",
                theory: "Quebramos as cadeias longas em pares. Atenção aos detalhes das variáveis auxiliares.",
                explanation: "Precisamos binarizar as regras longas que estão em S e B:\n\n1. S → A B S: Vira S → A D1, onde D1 → B S.\n\n2. B → Ca B A Cb (Regra de tamanho 4):\n   - Criamos D2 → A Cb\n   - Criamos D3 → B D2\n   - Regra vira: B → Ca D3\n\n3. B → Ca A Cb (Tamanho 3):\n   - Reusamos D2 (A Cb) ou criamos novo.\n   - Regra vira: B → Ca D2\n\n4. B → Ca B Cb (Tamanho 3):\n   - Criamos D4 → B Cb\n   - Regra vira: B → Ca D4\n\n(S herda essas mesmas transformações para suas cópias dessas regras).",
                result: "S → A D1 | B S | A S | A B | Ca A | a | Ca D3 | Ca D2 | Ca D4 | Ca Cb | ε\nA → Ca A | a\nB → Ca D3 | Ca D2 | Ca D4 | Ca Cb\n\n--- Auxiliares ---\nD1 → B S\nD2 → A Cb\nD3 → B D2\nD4 → B Cb\nCa → a\nCb → b"
            }
        ]
    },
    {
        id: 3,
        title: "Enigma III: O Ciclo de Unitárias (Ouroboros)",
        initialGrammar: "S → AB | bC | ε\nA → aA | BC | b\nB → bB | C | ε\nC → cC | a | S",
        steps: [
            {
                title: "Etapa 1: Purificação do Vazio",
                theory: "Anulação Total. O vazio se propaga pelo ciclo S->A->B->C->S. Todos são anuláveis.",
                explanation: "Todos os não-terminais podem sumir.\n- S → bC gera S → b\n- A → aA gera A → a\n- A → BC gera A → B e A → C\n- B → bB gera B → b\n- C → cC gera C → c\n\nAdicionamos essas possibilidades.",
                result: "S → AB | bC | b | A | B | ε\nA → aA | a | BC | B | C | b\nB → bB | b | C\nC → cC | c | a | S"
            },
            {
                title: "Etapa 2: Eliminação de Unitárias (O Conselho)",
                theory: "Detectamos o ciclo S->A->B->C->S. Em vez de substituições infinitas, tratamos todos como um bloco único de equivalência.",
                explanation: "1. Identificamos o ciclo: {S, A, B, C}.\n2. Coletamos TODAS as regras NÃO-unitárias de TODOS os membros:\n   - De S: AB, bC, b\n   - De A: aA, a, BC, b\n   - De B: bB, b\n   - De C: cC, c, a\n3. Unimos tudo: {AB, bC, b, aA, a, BC, bB, cC, c}\n4. Distribuímos esse conjunto para S, A, B e C.",
                result: "S → AB | bC | b | aA | a | BC | bB | cC | c | ε\nA → AB | bC | b | aA | a | BC | bB | cC | c\nB → AB | bC | b | aA | a | BC | bB | cC | c\nC → AB | bC | b | aA | a | BC | bB | cC | c"
            },
            {
                title: "Etapa 3: Isolação de Terminais",
                theory: "Isolamos a, b, c em regras mistas. Regras que são apenas um terminal (como 'a') permanecem inalteradas.",
                explanation: "Criamos Ca → a, Cb → b, Cc → c.\nSubstituímos nas regras mistas:\n- bC vira Cb C\n- aA vira Ca A\n- bB vira Cb B\n- cC vira Cc C",
                result: "(Para S, A, B, C):\n→ A B | Cb C | b | Ca A | a | B C | Cb B | Cc C | c | (ε apenas em S)\n\nCa → a\nCb → b\nCc → c"
            },
            {
                title: "Etapa 4: Binarização (Final)",
                theory: "Verificamos o tamanho das regras para garantir a forma binária.",
                explanation: "Analisamos as regras resultantes:\n- A B (Tamanho 2: OK)\n- Cb C (Tamanho 2: OK)\n- b (Tamanho 1 Terminal: OK)\n- Ca A (Tamanho 2: OK)\n- a (Tamanho 1 Terminal: OK)\n- B C (Tamanho 2: OK)\n- Cb B (Tamanho 2: OK)\n- Cc C (Tamanho 2: OK)\n- c (Tamanho 1 Terminal: OK)\n\nNenhuma regra tem tamanho 3 ou mais. A gramática já está na Forma Normal de Chomsky.",
                result: "S → A B | Cb C | b | Ca A | a | B C | Cb B | Cc C | c | ε\nA → A B | Cb C | b | Ca A | a | B C | Cb B | Cc C | c\nB → A B | Cb C | b | Ca A | a | B C | Cb B | Cc C | c\nC → A B | Cb C | b | Ca A | a | B C | Cb B | Cc C | c\nCa → a\nCb → b\nCc → c"
            }
        ]
    },
    {
        id: 4,
        title: "Enigma IV: Os Símbolos Inúteis",
        initialGrammar: "S → A | ABa | AbA\nA → Aa | ε\nB → Bb | BC\nC → CB | CA | bB",
        steps: [
            {
                title: "Etapa 1: Purificação do Vazio",
                theory: "A é anulável. S é anulável (S->A). B e C NÃO são anuláveis (não há caminho para ε).",
                explanation: "Removemos A->ε.\nEm S->AbA, consideramos todas as combinações de A sumindo: gera bA, Ab, b.\nEm S->ABa, gera Ba.\nEm C->CA, gera C (unitária).",
                result: "S0 → S | ε\nS → A | ABa | Ba | AbA | bA | Ab | b\nA → Aa | a\nB → Bb | BC\nC → CB | CA | C | bB"
            },
            {
                title: "Etapa 2: Purga de Inúteis e Unitárias",
                theory: "CRUCIAL: Variáveis que nunca geram terminais (ficam em loop infinito de variáveis) são INÚTEIS e devem ser deletadas.",
                explanation: "Análise de Utilidade:\n- A gera 'a'. Útil.\n- B gera 'Bb' ou 'BC'. B precisa de B ou C. Nunca termina. B é inútil.\n- C gera 'CB', 'CA', 'bB'. Todos dependem de B ou C (mesmo CA vira Ca, C permanece). C é inútil.\n\nAÇÃO: Removemos B e C e TODAS as regras que contêm B ou C.\nRemovemos também S->A substituindo por Aa|a.",
                result: "S0 → S | ε\nS → AbA | bA | Ab | b | Aa | a\nA → Aa | a\n(B e C foram purgados, regras como ABa e Ba sumiram)"
            },
            {
                title: "Etapa 3: Isolação de Terminais",
                theory: "Isolamos 'a' e 'b' nas regras restantes de S e A.",
                explanation: "Criamos Ca->a e Cb->b.\nSubstituímos:\n- AbA vira A Cb A\n- bA vira Cb A\n- Ab vira A Cb\n- Aa vira A Ca",
                result: "S0 → S | ε\nS → A Cb A | Cb A | A Cb | b | A Ca | a\nA → A Ca | a\nCa → a\nCb → b"
            },
            {
                title: "Etapa 4: Binarização (Final)",
                theory: "Quebramos a única regra longa restante.",
                explanation: "A regra 'S → A Cb A' tem 3 símbolos. Criamos D1 → Cb A. A regra se torna S → A D1.",
                result: "S0 → S | ε\nS → A D1 | Cb A | A Cb | b | A Ca | a\nA → A Ca | a\nD1 → Cb A\nCa → a\nCb → b"
            }
        ]
    }
];