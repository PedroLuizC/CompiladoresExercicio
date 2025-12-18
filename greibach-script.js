// ============================================================================
// O CÓDICE DE GREIBACH (QUESTÃO 1 - COMPLETA E SEM OMISSÕES)
// ============================================================================

const greibachQuestions = [
    
     {
        id: 1,
        title: "Enigma I: A Ilusão (Símbolos Inúteis)",
        initialGrammar: "S → A | ABa | AbA\nA → Aa | ε\nB → Bb | BC\nC → CB | CA | bB",
        steps: [
            {
                title: "Etapa 1: Purificação do Vazio (ε)",
                theory: "O primeiro passo do Grande Ritual é sempre expurgar a instabilidade do Vazio. Identificamos as variáveis anuláveis e propagamos suas consequências para todas as regras.",
                explanation: "Identificação: A é anulável (A → ε). S é anulável (S → A). B e C NÃO são anuláveis (não há caminho para ε).\n\nPropagação:\n- A → Aa gera: A → a\n- S → AbA gera todas as combinações: S → bA | Ab | b\n- S → ABa gera: S → Ba (se A sumir)\n- C → CA gera: C → C (se A sumir - regra unitária)\n\n(Nota: Ainda não removemos B e C, apenas lidamos com o ε).",
                result: "S0 → S | ε\nS → A | ABa | Ba | AbA | bA | Ab | b\nA → Aa | a\nB → Bb | BC\nC → CB | CA | bB | C"
            },
            {
                title: "Etapa 2: A Purga dos Símbolos Inúteis",
                theory: "Para estar em GNF, uma variável deve ser capaz de gerar uma cadeia de terminais. Variáveis que ficam presas em loops infinitos de variáveis são 'Não-Geradoras' e devem ser eliminadas.",
                explanation: "Análise de Vida:\n- A gera 'a'. Útil.\n- B gera 'Bb' ou 'BC'. B precisa de B ou C para existir. Nunca termina em apenas terminais. B é Inútil.\n- C gera 'CB', 'bB', 'CA', 'C'. Todas as regras dependem de B (que é inútil) ou do próprio C (mesmo 'CA' vira 'Ca', C permanece). C é Inútil.\n\nO Veredito: Removemos B e C e TODAS as regras em S que contêm B ou C (ABa, Ba).",
                result: "S0 → S | ε\nS → A | AbA | bA | Ab | b\nA → Aa | a\n(B e C foram purgados da existência)"
            },
            {
                title: "Etapa 3: Romper Correntes Unitárias",
                theory: "Eliminamos delegações simples (A → B) para garantir que cada regra avance na construção da palavra.",
                explanation: "Temos a regra unitária S → A.\nSubstituímos 'A' pelas suas produções sobreviventes: {Aa, a}.\nAgora S gera diretamente o que A gerava.",
                result: "S0 → S | ε\nS → Aa | a | AbA | bA | Ab | b\nA → Aa | a"
            },
            {
                title: "Etapa 4: Indexação Hierárquica",
                theory: "Estabelecemos a Cadeia de Comando. Renomeamos as variáveis para verificar se o fluxo de dependência é válido (i < j).",
                explanation: "Definimos a Hierarquia:\n- S torna-se A1\n- A torna-se A2\n\nReescrevemos a gramática com os novos nomes.",
                result: "A1 → A2 a | a | A2 b A2 | b A2 | A2 b | b\nA2 → A2 a | a"
            },
            {
                title: "Etapa 5: Quebra de Recursão à Esquerda (A2)",
                theory: "A2 começa com ele mesmo (A2 → A2 a). Isso é um paradoxo temporal. Aplicamos o ritual de quebra: A → Aα | β torna-se A → βA' e A' → αA' | ε.",
                explanation: "Em A2 → A2 a | a:\n- A parte recursiva (α) é 'a'.\n- A parte de saída (β) é 'a'.\n\nCriamos o auxiliar A2' (chamaremos de Z para clareza visual, ou A2_linha).\nNova regra A2: Começa com a saída (a) seguida do auxiliar.\nNova regra A2': Repete a cauda (a) ou para (ε).",
                result: "A1 → A2 a | a | A2 b A2 | b A2 | A2 b | b\nA2 → a A2'\nA2' → a A2' | ε"
            },
            {
                title: "Etapa 6: Banimento Final do Vazio e Consolidação",
                theory: "A2' tem ε. GNF não tolera ε. Propagamos a ausência de A2' para solidificar as regras.",
                explanation: "1. Em A2' → a A2': se A2' some, gera 'a'. Nova regra: A2' → a A2' | a.\n2. Em A2 → a A2': se A2' some, gera 'a'. Nova regra: A2 → a A2' | a.\n\nAgora A2 e A2' são sólidos e começam com terminais.",
                result: "A2 → a A2' | a\nA2' → a A2' | a\n(A1 permanece esperando substituição)"
            },
            {
                title: "Etapa 7: Substituição Final em Cascata (A1)",
                theory: "O General A1 ainda delega para A2. Como A2 agora é sólido (começa com terminal 'a'), substituímos todas as ocorrências iniciais de A2 em A1 pelas produções de A2.",
                explanation: "Regras de A1 que começam com A2:\n1. A1 → A2 a\n2. A1 → A2 b A2\n3. A1 → A2 b\n\nSubstituímos A2 por {a A2', a} em cada uma:\n\n- Para A2 a: gera 'a A2' a' e 'a a'\n- Para A2 b A2: gera 'a A2' b A2' e 'a b A2'\n- Para A2 b: gera 'a A2' b' e 'a b'\n\nMantemos as regras que já eram terminais (a, b A2, b).",
                result: "S (A1) → a A2' a | a a | a A2' b A2 | a b A2 | a A2' b | a b | a | b A2 | b\nA (A2) → a A2' | a\nZ (A2') → a A2' | a"
            }
        ]
    },
    {
        id: 2,
        title: "Enigma II: A Substituição Simples",
        initialGrammar: "S → AB | BCS\nA → aA | C\nB → bbB | b\nC → cC | λ",
        steps: [
            {
                title: "Etapa 1: Purificação do Vazio (λ)",
                theory: "Identificamos os pontos de falha estrutural (anuláveis). Se um componente pode desaparecer, devemos prever o que resta no lugar dele.",
                explanation: "1. Identificação: C é anulável (C → λ). A é anulável porque A → C. (S e B não são).\n\n2. Propagação:\n- Em C → cC: se C some, resta 'c'.\n- Em A → aA: se A some, resta 'a'.\n- Em S → AB: se A some, resta 'B'.\n- Em S → BCS: se C some, resta 'BS'.\n\n3. Limpeza: Removemos C → λ.",
                result: "S → AB | BCS | B | BS\nA → aA | a | C\nB → bbB | b\nC → cC | c"
            },
            {
                title: "Etapa 2: Romper Correntes Unitárias",
                theory: "Eliminamos os mensageiros que não geram terminais. Onde houver X → Y, X deve assumir o trabalho de Y.",
                explanation: "Temos duas correntes unitárias:\n1. A → C: Substituímos C pelas suas produções {cC, c}.\n   Agora A → aA | a | cC | c.\n\n2. S → B: Substituímos B pelas suas produções {bbB, b}.\n   Agora S → AB | BCS | BS | bbB | b.",
                result: "S → AB | BCS | BS | bbB | b\nA → aA | a | cC | c\nB → bbB | b\nC → cC | c"
            },
            {
                title: "Etapa 3: Indexação Hierárquica e Análise",
                theory: "Estabelecemos a ordem (S=A1, A=A2, B=A3, C=A4) e verificamos a disciplina (recursão à esquerda).",
                explanation: "Análise das Regras Iniciais:\n- A (A2) começa com 'a' ou 'c'. (OK)\n- B (A3) começa com 'b'. (OK)\n- C (A4) começa com 'c'. (OK)\n- S (A1) começa com A (A2), B (A3) ou 'b'.\n\nConclusão: Não há recursão à esquerda (ninguém começa consigo mesmo) e não há quebra de hierarquia inversa (ninguém chama um superior). Apenas delegação descendente.",
                result: "A gramática já está hierarquicamente correta. Não precisamos de A' ou quebra de ciclos.\nAvançamos direto para a substituição."
            },
            {
                title: "Etapa 4: Substituição Progressiva (O General S)",
                theory: "Para alcançar a FNG, todas as regras devem começar com terminais. A, B e C já obedecem. S ainda delega para A e B. Devemos forçar S a dar ordens diretas.",
                explanation: "Substituímos os líderes iniciais nas regras de S:\n\n1. Em S → AB: Substituímos A por {aA, a, cC, c}.\n   Gera: aAB | aB | cCB | cB\n\n2. Em S → BCS: Substituímos B por {bbB, b}.\n   Gera: bbBCS | bCS\n\n3. Em S → BS: Substituímos B por {bbB, b}.\n   Gera: bbBS | bS\n\n4. As regras originais de S que já eram terminais (bbB, b) permanecem.",
                result: "S → aAB | aB | cCB | cB | bbBCS | bCS | bbBS | bS | bbB | b\nA → aA | a | cC | c\nB → bbB | b\nC → cC | c"
            }
        ]
    },
    {
        id: 3,
        title: "Enigma III: A Matriz Pura (Anulação Total)",
        initialGrammar: "S → A | B | ABS\nA → aA | λ\nB → aBAb | λ",
        steps: [
            {
                title: "Etapa 1: Purificação do Vazio (Ritual Agressivo)",
                theory: "Quando múltiplos símbolos são anuláveis, a explosão combinatória é inevitável. Devemos mapear todas as realidades onde A, B ou S deixam de existir.",
                explanation: "1. Identificação: A → λ, B → λ. S → A (logo S é anulável). Vλ = {S, A, B}.\n\n2. Propagação Agressiva:\n- Em A → aA: gera 'a'.\n- Em B → aBAb: gera 'aAb' (B some), 'aBb' (A some), 'ab' (ambos somem).\n- Em S → ABS: gera todas as 7 combinações não-vazias + o próprio vazio.\n  (AS, BS, AB, S, A, B, ε).\n\n3. Consolidação: Adicionamos essas novas regras à gramática.",
                result: "S → A | B | ABS | AS | BS | AB | S | λ\nA → aA | a\nB → aBAb | aAb | aBb | ab"
            },
            {
                title: "Etapa 2: Romper Correntes Unitárias",
                theory: "O Vazio criou ciclos (S → S) e redundâncias (S → A, S → B). O General S deve assumir o comando direto.",
                explanation: "1. Removemos a tautologia S → S.\n2. Substituímos S → A pelas produções de A: {aA, a}.\n3. Substituímos S → B pelas produções de B: {aBAb, aAb, aBb, ab}.\n\nAgora S possui suas regras complexas (ABS...) mais as regras herdadas.",
                result: "S → ABS | AS | BS | AB | aA | a | aBAb | aAb | aBb | ab | λ\nA → aA | a\nB → aBAb | aAb | aBb | ab"
            },
            {
                title: "Etapa 3: Indexação e Análise de Recursão",
                theory: "Estabelecemos a hierarquia (S=A1, A=A2, B=A3). Verificamos se há recursão à esquerda direta.",
                explanation: "Hierarquia: A1(S), A2(A), A3(B).\n\nAnálise:\n- A2 começa com 'a'. (OK)\n- A3 começa com 'a'. (OK)\n- A1 começa com A2 (ABS, AS, AB, aA...), A3 (BS, aBAb...) ou 'a'.\n\nNão há recursão à esquerda direta (nenhum Ai → Ai...). O fluxo é descendente.",
                result: "A gramática está limpa de ciclos viciosos. A e B já estão em FNG. Apenas S precisa de substituição."
            },
            {
                title: "Etapa 4: Substituição Final em Cascata",
                theory: "O General S (A1) delega para A (A2) e B (A3). Como A2 e A3 já são sólidos (começam com terminais), substituímos suas chamadas em S.",
                explanation: "Substituímos os líderes em S:\n\n1. Regras começando com A (ABS, AS, AB, aA...): Substituímos A por {aA, a}.\n   - ABS vira: aABS | aBS\n   - AS vira: aAS | aS\n   - AB vira: aAB | aB\n\n2. Regras começando com B (BS...): Substituímos B por {aBAb, aAb, aBb, ab}.\n   - BS vira: aBAbS | aAbS | aBbS | abS\n\n3. Regras que já eram terminais ou herdadas (a, aBAb...) permanecem.",
                result: "S → aABS | aBS | aAS | aS | aAB | aB | aBAbS | aAbS | aBbS | abS | aA | a | aBAb | aAb | aBb | ab | λ\nA → aA | a\nB → aBAb | aAb | aBb | ab"
            }
        ]
    },
    {
        id: 4,
        title: "Enigma IV: O Grande Ritual (Hierarquia Estrita)",
        initialGrammar: "S → Aa | b\nA → Bb | c\nB → Sc | d",
        steps: [
            {
                title: "Etapa 1: Indexação Hierárquica",
                theory: "Quando não há vazio ou unitárias, mas há ciclos (S->A->B->S), devemos impor uma ordem artificial para processar as regras linearmente.",
                explanation: "Definimos as patentes:\n- S torna-se A1\n- A torna-se A2\n- B torna-se A3\n\nReescrevemos a gramática com os novos nomes.",
                result: "A1 → A2 a | b\nA2 → A3 b | c\nA3 → A1 c | d"
            },
            {
                title: "Etapa 2: Purificação da Cadeia de Comando",
                theory: "A Lei de Greibach exige que Ai só chame Aj se j > i. Se j < i, é insubordinação e deve ser substituído.",
                explanation: "Inspeção de A3 (rank 3):\n1. A3 começa com A1 (1 < 3). VIOLAÇÃO. Substituímos A1 por {A2a, b}.\n   A3 vira: A2 a c | b c | d\n\n2. Agora A3 começa com A2 (2 < 3). VIOLAÇÃO. Substituímos A2 por {A3b, c}.\n   A3 vira: A3 b a c | c a c | b c | d\n\nAgora A3 começa com A3 (Recursão) ou terminais. A hierarquia inversa foi eliminada.",
                result: "A3 → A3 b a c | c a c | b c | d\n(A1 e A2 permanecem inalterados aguardando a cascata)"
            },
            {
                title: "Etapa 3: Quebra do Paradoxo Temporal",
                theory: "A purificação criou uma Recursão à Esquerda em A3 (A3 → A3...). Devemos quebrá-la criando um auxiliar A3'.",
                explanation: "Em A3 → A3 b a c | c a c | b c | d:\n- A parte recursiva (α) é 'b a c'.\n- As saídas (β) são 'c a c', 'b c', 'd'.\n\nCriamos A3'.\nNovas regras de A3: βA3' (c a c A3' | b c A3' | d A3').\nNovas regras de A3': αA3' | ε (b a c A3' | ε).",
                result: "A3 → c a c A3' | b c A3' | d A3'\nA3' → b a c A3' | ε"
            },
            {
                title: "Etapa 4: Banimento do Fantasma (ε)",
                theory: "Antes da montagem final, removemos o ε de A3' para solidificar a base.",
                explanation: "1. Em A3' → b a c A3': se o último some, resta 'b a c'.\n2. Em A3: propagamos a ausência de A3' para todas as regras.\n   (c a c A3' vira c a c, etc).",
                result: "A3 → c a c A3' | b c A3' | d A3' | c a c | b c | d\nA3' → b a c A3' | b a c"
            },
            {
                title: "Etapa 5: Substituição Final em Cascata",
                theory: "Com A3 e A3' sólidos e em FNG, subimos a hierarquia consertando A2 e depois A1.",
                explanation: "1. Consertando A2 (A2 → A3 b | c): Substituímos A3 pelas suas 6 regras.\n   Gera: c a c A3' b | b c A3' b | d A3' b | c a c b | b c b | d b | c.\n\n2. Consertando A1 (A1 → A2 a | b): Substituímos A2 pelas suas 7 novas regras.\n   Gera: c a c A3' b a | ... | c a | b.",
                result: "A1 → c a c A3' b a | b c A3' b a | d A3' b a | c a c b a | b c b a | d b a | c a | b\nA2 → c a c A3' b | b c A3' b | d A3' b | c a c b | b c b | d b | c\nA3 → c a c A3' | b c A3' | d A3' | c a c | b c | d\nA3' → b a c A3' | b a c"
            }
        ]
    },
    {
        id: 5,
        title: "Enigma V: A Serpente de Duas Cabeças",
        initialGrammar: "S → aAd | A\nA → Bc | λ\nB → Ac | a",
        steps: [
            {
                title: "Etapa 1: Purificação do Vazio e Unitárias",
                theory: "O primeiro passo é solidificar a base. Identificamos anuláveis e removemos delegações inúteis.",
                explanation: "1. Anulação: A é anulável (A→λ). S é anulável (S→A). B não é.\n   - Propagamos em S→aAd (vira ad).\n   - Propagamos em B→Ac (vira c).\n   - Removemos A→λ.\n2. Unitárias: S→A é inútil. Substituímos A pelas suas produções (Bc).",
                result: "S → aAd | ad | Bc | λ\nA → Bc\nB → Ac | c | a"
            },
            {
                title: "Etapa 2: Indexação Hierárquica",
                theory: "Estabelecemos a ordem para detectar ciclos. S=A1, A=A2, B=A3.",
                explanation: "Reescrevemos a gramática:\n- A1 (S) → a A2 d | a d | A3 c | λ\n- A2 (A) → A3 c\n- A3 (B) → A2 c | c | a",
                result: "A1 → a A2 d | a d | A3 c | λ\nA2 → A3 c\nA3 → A2 c | c | a"
            },
            {
                title: "Etapa 3: Purificação da Cadeia de Comando",
                theory: "Inspecionamos a hierarquia (Ai → Aj). Se j < i, substituímos. O fluxo deve ser crescente.",
                explanation: "1. A1 começa com 'a' ou A3 (3>1). OK.\n2. A2 começa com A3 (3>2). OK.\n3. A3 começa com A2 (2 < 3). VIOLAÇÃO.\n\nCorreção em A3: Substituímos A2 por sua produção (A3 c).\n- A3 → A2 c torna-se A3 → A3 c c.",
                result: "A3 → A3 c c | c | a\n(A1 e A2 permanecem inalterados aguardando a cascata)"
            },
            {
                title: "Etapa 4: Quebra do Paradoxo Temporal",
                theory: "A purificação criou Recursão à Esquerda em A3. Devemos quebrá-la criando um auxiliar A3'.",
                explanation: "Em A3 → A3 c c | c | a:\n- Parte recursiva (α): c c\n- Saídas (β): c, a\n\nAplicamos o ritual:\n- A3 vira β A3' (c A3' | a A3')\n- A3' vira α A3' | ε (c c A3' | ε)",
                result: "A3 → c A3' | a A3'\nA3' → c c A3' | ε"
            },
            {
                title: "Etapa 5: Banimento do Fantasma e Cascata Final",
                theory: "Removemos ε de A3' e propagamos a solidez de baixo para cima (A3 -> A2 -> A1).",
                explanation: "1. Banir ε de A3': A3' → ccA3' vira {ccA3', cc}. A3 → cA3' vira {cA3', c}. A3 → aA3' vira {aA3', a}.\n\n2. Consertar A2 (A2 → A3 c): Substituímos A3 pelas suas 4 novas regras.\n   - cA3' c | aA3' c | c c | a c\n\n3. Consertar A1 (A1 → A3 c): Substituímos A3 pelas suas 4 novas regras.\n   - cA3' c | aA3' c | c c | a c",
                result: "A1 → a A2 d | a d | c A3' c | a A3' c | c c | a c | λ\nA2 → c A3' c | a A3' c | c c | a c\nA3 → c A3' | a A3' | c | a\nA3' → c c A3' | c c"
            }
        ]
    },
    {
        id: 6,
        title: "Enigma VI: O Ouroboros (Ciclo Total)",
        initialGrammar: "S → AB | bC | ε\nA → aA | BC | b\nB → bB | C | ε\nC → cC | a | S",
        steps: [
            {
                title: "Etapa 1: Purificação Total (O Vazio e o Conselho)",
                theory: "Anulação Total e Ciclo Unitário. O vazio se propaga por S->A->B->C->S. Todos são anuláveis. O ciclo unitário torna todos equivalentes.",
                explanation: "1. Identificação: Todos são anuláveis (Vλ = {S,A,B,C}).\n2. Unificação: Detectamos o ciclo S->A->B->C->S. Coletamos TODAS as produções não-unitárias de TODOS os membros: {AB, bC, aA, a, b, BC, bB, cC, c}. Distribuímos esse conjunto 'Tesouro' para S, A, B e C.",
                result: "S → AB | bC | aA | a | b | BC | bB | cC | c | ε\nA → AB | bC | aA | a | b | BC | bB | cC | c\nB → AB | bC | aA | a | b | BC | bB | cC | c\nC → AB | bC | aA | a | b | BC | bB | cC | c"
            },
            {
                title: "Etapa 2: Indexação e Quebra de Recursão em Massa",
                theory: "Redundância Total. Todas as variáveis (A1, A2, A3, A4) têm as mesmas regras, incluindo recursão direta (A -> aA...).",
                explanation: "Aplicamos o ritual de quebra de recursão para CADA variável individualmente (mas o resultado é idêntico para todas).\n\nPara qualquer Ai:\n- Recursão (α): a, b, c (das regras aA, bB, cC onde A=B=C=Ai).\n- Saídas (β): AB, bC, a, b, BC, c (regras que não começam com Ai).\n\nCriamos auxiliares Ai' para cada um.\nAi → β Ai'\nAi' → α Ai' | ε",
                result: "A1 → AB A1' | bC A1' | a A1' | b A1' | BC A1' | c A1'\nA1' → a A1' | b A1' | c A1' | ε\n(Repetido identicamente para A2, A3, A4)"
            },
            {
                title: "Etapa 3: Substituição Final em Cascata (Conceitual)",
                theory: "A gramática se tornou massiva. A substituição final garantiria que o início de cada regra fosse um terminal.",
                explanation: "Como todas as variáveis são funcionalmente idênticas e já possuem regras começando com terminais (a, b, c), a substituição final apenas expandiria as combinações. O resultado é uma gramática onde qualquer variável pode gerar qualquer sequência válida da linguagem, começando imediatamente com um terminal.",
                result: "Regras finais em FNG para S, A, B, C (Extenso, mas seguindo o padrão de iniciar com a, b, ou c)."
            }
        ]
    },
     {
        id: 7,
        title: "Enigma VII: A Cascata Simples",
        initialGrammar: "S → AB | a\nA → aA | ε\nB → bB | ε",
        steps: [
            {
                title: "Etapa 1: Purificação do Vazio (Ritual Agressivo)",
                theory: "A e B são anuláveis. S depende deles (S→AB), logo S também é anulável. Devemos mapear todas as combinações de desaparecimento.",
                explanation: "1. Identificação: Vλ = {S, A, B}.\n2. Propagação:\n   - A → aA gera: A → a.\n   - B → bB gera: B → b.\n   - S → AB gera: A (B some), B (A some), ε (ambos somem).\n3. Consolidação: Adicionamos as novas regras.",
                result: "S → AB | a | A | B | ε\nA → aA | a\nB → bB | b"
            },
            {
                title: "Etapa 2: Eliminação de Unitárias",
                theory: "O Vazio criou atalhos unitários (S→A, S→B). O General deve assumir o comando direto.",
                explanation: "1. Substituímos S → A por {aA, a}.\n2. Substituímos S → B por {bB, b}.\n\nAgora S possui: {AB, a, aA, bB, b, ε}.",
                result: "S → AB | a | aA | bB | b | ε\nA → aA | a\nB → bB | b"
            },
            {
                title: "Etapa 3: Indexação e Análise",
                theory: "Estabelecemos S=A1, A=A2, B=A3. Verificamos a necessidade de quebra de ciclos.",
                explanation: "Hierarquia:\n- A2 (A) começa com 'a'. (OK)\n- A3 (B) começa com 'b'. (OK)\n- A1 (S) começa com terminais ('a', 'b') ou com A2 (na regra AB).\n\nConclusão: Nenhuma recursão à esquerda. A hierarquia é respeitada (1 chama 2). Avançamos direto para a substituição.",
                result: "A gramática já está ordenada. Apenas A1 precisa de ajuste."
            },
            {
                title: "Etapa 4: Substituição Final em Cascata",
                theory: "A regra S → AB começa com uma variável (A). Como A já está em FNG, substituímos.",
                explanation: "Na regra S → AB, substituímos A por suas produções {aA, a}.\n- aA entra: gera aAB.\n- a entra: gera aB.\n\nAs outras regras de S (a, aA, bB, b, ε) já estão corretas.",
                result: "S → aAB | aB | a | aA | bB | b | ε\nA → aA | a\nB → bB | b"
            }
        ]
    }
];
