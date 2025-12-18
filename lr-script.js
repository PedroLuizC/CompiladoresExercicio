/**
 * Módulo: Análise Sintática Ascendente (LR)
 * Arquivo: lr-script.js
 * Conteúdo: Questão 1 - Expressões Aritméticas (Abordagem Manual/Humana)
 */

const lrQuestions = [
    {
        title: "O Cânone da Forja (Análise Manual)",
        initialGrammar: 
`Gramática de Expressões Aritméticas:
1. E -> E + T
2. E -> T
3. T -> ( E )
4. T -> id

Entrada: id + ( id )`,
        steps: [
            {
                title: "A Campanha: Verificação Intuitiva",
                theory: "Sem tabela de estados. O 'Autômato Humano' olha para a Pilha (Mesa) em busca de uma 'Alça' (um padrão que casa com o lado direito de uma regra) e decide se reduz ou avança.",
                explanation: "Observe a lógica na Fase 3: Por que transformamos T em E? Porque a regra de soma é 'E + T'. O '+' estava vindo, então precisávamos ter um 'E' pronto na esquerda para recebê-lo.",
                result: 
`PILHA (Mesa)        ENTRADA       AÇÃO / RACIOCÍNIO
-----------------------------------------------------------------------
1. $                id + ( id ) $ SHIFT 'id'
                                  (Mesa vazia. Pegar matéria-prima.)

2. $ id             + ( id ) $    REDUCE T -> id
                                  (O 'id' na mesa casa com a regra 4.
                                   Transformamos em T.)

3. $ T              + ( id ) $    REDUCE E -> T
                                  (Temos um T. O próximo é '+'. A gramática
                                   diz 'E + T'. Precisamos promover o T da
                                   mesa para E para encaixar no '+'.)

4. $ E              + ( id ) $    SHIFT '+'
                                  (Temos a base E. Pegamos o operador.)

5. $ E +            ( id ) $      SHIFT '('
                                  (Iniciando uma sub-estrutura.)

6. $ E + (          id ) $        SHIFT 'id'
                                  (Pegando o conteúdo do parêntese.)

7. $ E + ( id       ) $           REDUCE T -> id
                                  (O 'id' vira T.)

8. $ E + ( T        ) $           REDUCE E -> T
                                  (Temos T. O próximo é ')'. Dentro dos
                                   parênteses, a regra é (E). O T deve
                                   evoluir para E.)

9. $ E + ( E        ) $           SHIFT ')'
                                  (Fechando a estrutura.)

10. $ E + ( E )     $             REDUCE T -> ( E )
                                  (Olhe o topo: '( E )'. É uma Alça
                                   perfeita para a regra 3!)

11. $ E + T         $             REDUCE E -> E + T
                                  (Olhe a mesa toda: 'E + T'. É a Alça
                                   da regra 1. A soma acontece agora.)

12. $ E             $             ACEITO
                                  (Sobrou apenas o Símbolo Inicial)`
            }
        ]
    },
    {
        title: "O Cânone da Precedência",
        initialGrammar: 
`Uma gramática hierárquica para impor a ordem matemática (Multiplicação > Soma).

1. E -> E + T
2. E -> T
3. T -> T * F
4. T -> F
5. F -> ( E )
6. F -> id

Entrada: ( id * id )`,
        steps: [
            {
                title: "A Campanha: Verificação Intuitiva",
                theory: "O teste de paciência dentro de uma estrutura protegida. O autômato entra no parêntese, resolve a multiplicação interna e só depois resolve o grupo externo.",
                explanation: "Atenção à Fase 6. Temos um T na mesa e vemos '*'. Não reduzimos para E porque a multiplicação tem prioridade e deve ser resolvida no nível T.",
                result: 
`PILHA (Mesa)        ENTRADA       AÇÃO / RACIOCÍNIO
-----------------------------------------------------------------------
1. $                ( id * id ) $ SHIFT '('
                                  (Começando estrutura protegida.)

2. $ (              id * id ) $   SHIFT 'id'
                                  (Pegando o primeiro operando.)

3. $ ( id           * id ) $      REDUCE F -> id
                                  (Identificamos a unidade F.)

4. $ ( F            * id ) $      REDUCE T -> F
                                  (Promovemos para T.)

5. $ ( T            * id ) $      SHIFT '*'  <-- MOMENTO CRÍTICO
                                  (Temos T. Próximo é *. Se reduzirmos
                                   para E, perdemos a chance de multiplicar.
                                   A gramática diz T*F. Esperamos!)

6. $ ( T *          id ) $        SHIFT 'id'
                                  (Pegando o segundo operando.)

7. $ ( T * id       ) $           REDUCE F -> id
                                  (O 'id' vira F.)

8. $ ( T * F        ) $           REDUCE T -> T * F
                                  (Olhe a mesa: "T * F". É a Alça da
                                   multiplicação. Resolvemos agora!)

9. $ ( T            ) $           REDUCE E -> T
                                  (Temos o resultado do produto. O próximo
                                   é ')'. A regra interna pede um E.
                                   Promovemos T para E.)

10. $ ( E           ) $           SHIFT ')'
                                  (Fechamos o parêntese.)

11. $ ( E )         $             REDUCE F -> ( E )
                                  (O grupo '(E)' inteiro vira um F.)

12. $ F             $             REDUCE T -> F
                                  (Promovemos para T.)

13. $ T             $             REDUCE E -> T
                                  (Promovemos para E final.)

14. $ E             $             ACEITO`
            }
        ]
    }
];