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
                result: "S → Ca D1 | Ca Cd | B Cc | ε\nD1 → A Cd\nA → B Cc\nB → A Cc | Cc | a\nCa → a\nCc → c\nCd → d"
            }
        ]
    },
    {
        id: 2,
        title: "Enigma II: A Anulação em Massa",
        initialGrammar: "S → A | B | ABS\nA → aA | ε\nB → aBAb | ε",
        steps: [
            {
                title: "Etapa 1: Purificação do Vazio (Ritual Agressivo)",
                theory: "Quando múltiplos símbolos (A, B) e o próprio S são anuláveis, usamos a lógica combinatória: para uma regra como ABS, geramos todas as permutações de desaparecimento.",
                explanation: "S é anulável. A é anulável. B é anulável.\n\nExpandindo S → ABS:\n- Se A some: BS\n- Se B some: AS\n- Se S some: AB\n- Se A e B somem: S\n- Se A e S somem: B\n- Se B e S somem: A\n- Se todos somem: ε\n\nExpandindo B → aBAb:\n- Se B some: aAb\n- Se A some: aBb\n- Se ambos somem: ab",
                result: "S → A | B | ABS | BS | AS | AB | S | ε\nA → aA | a\nB → aBAb | aAb | aBb | ab"
            },
            {
                title: "Etapa 2: Eliminação de Unitárias",
                theory: "Removemos ciclos inúteis (S → S) e fazemos S herdar diretamente o poder de seus subordinados A e B.",
                explanation: "1. Removemos S → S.\n2. S → A é substituído por {aA, a}.\n3. S → B é substituído por {aBAb, aAb, aBb, ab}.\n\nJuntamos isso com as regras não-unitárias que S já tinha (ABS, BS, AS, AB, ε).",
                result: "S → ABS | BS | AS | AB | aA | a | aBAb | aAb | aBb | ab | ε\nA → aA | a\nB → aBAb | aAb | aBb | ab"
            },
            {
                title: "Etapa 3: Isolação de Terminais",
                theory: "Preparamos a gramática para a binarização isolando a matéria bruta ('a' e 'b') em variáveis 'Ca' e 'Cb' onde elas aparecem misturadas.",
                explanation: "Criamos Ca → a e Cb → b.\nSubstituições:\n- aA → Ca A\n- aBAb → Ca B Ca Cb\n- aAb → Ca A Cb\n- aBb → Ca B Cb\n- ab → Ca Cb",
                result: "S → A B S | B S | A S | A B | Ca A | a | Ca B Ca Cb | Ca A Cb | Ca B Cb | Ca Cb | ε\nA → Ca A | a\nB → Ca B Ca Cb | Ca A Cb | Ca B Cb | Ca Cb\nCa → a\nCb → b"
            },
            {
                title: "Etapa 4: Binarização (Final)",
                theory: "A etapa mais complexa. Todas as cadeias longas devem ser reduzidas a pares usando variáveis auxiliares.",
                explanation: "Vamos criar auxiliares para cada regra longa:\n\n1. S → A B S (vira A D1, onde D1 → B S)\n2. Regras longas vindas de B (como Ca B Ca Cb):\n   - Ca B Ca Cb vira Ca D2. D2 → B D3. D3 → Ca Cb.\n   - Ca A Cb vira Ca D4. D4 → A Cb.\n   - Ca B Cb vira Ca D5. D5 → B Cb.\n\nAplicamos essas auxiliares tanto em B quanto nas cópias que estão em S.",
                result: "S → A D1 | B S | A S | A B | Ca A | a | Ca D2 | Ca D4 | Ca D5 | Ca Cb | ε\nA → Ca A | a\nB → Ca D2 | Ca D4 | Ca D5 | Ca Cb\n\n--- Variáveis Auxiliares ---\nD1 → B S\nD2 → B D3\nD3 → Ca Cb\nD4 → A Cb\nD5 → B Cb\nCa → a\nCb → b"
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