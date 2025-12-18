// ============================================================================
// O MOTOR DO ORATÓRIO (LÓGICA E INTERAÇÃO)
// ============================================================================

// Estado Inicial do Sistema
let currentModule = 'chomsky'; // Módulo ativo por padrão
let currentData = chomskyQuestions; // Dados ativos por padrão (assumindo que chomsky-script.js carregou)
let currentQuestIndex = 0;
let currentStepIndex = -1; 

// Cache de Elementos do DOM (Para performance)
const els = {
    questTitle: document.getElementById('quest-title'),
    stepsContainer: document.getElementById('steps-container'),
    advanceBtn: document.getElementById('advance-btn'),
    resetBtn: document.getElementById('reset-btn'),
    prevQuestBtn: document.getElementById('prev-quest-btn'),
    nextQuestBtn: document.getElementById('next-quest-btn'),
    navBtns: document.querySelectorAll('.nav-btn')
};

// ============================================================================
// FUNÇÕES PRINCIPAIS
// ============================================================================

/**
 * Inicializa o Oratório.
 * Chamado quando a página termina de carregar.
 */
function init() {
    setupNavigation();
    loadQuestion(0);
    addEventListeners();
}

/**
 * Configura os botões de navegação do topo (Chomsky / Greibach).
 */
function setupNavigation() {
    els.navBtns.forEach(btn => {
        // Ativa o botão Greibach se ele estiver lá
        if (btn.innerText.trim() === "Greibach") {
            btn.classList.remove('disabled');
            btn.dataset.module = 'greibach';
            btn.removeAttribute('title');
        }

        btn.addEventListener('click', (e) => {
            const module = e.target.dataset.module;
            if (!module) return; // Ignora botões desativados

            // Atualiza visual (Classe active)
            els.navBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            // Troca o Módulo e os Dados
            currentModule = module;

            // ATUALIZE ESTA PARTE DA LÓGICA DE SELEÇÃO:
            if (module === 'chomsky') {
                    currentData = chomskyQuestions;
                } else if (module === 'greibach') {
                    currentData = greibachQuestions;
                } else if (module === 'll') {
                    currentData = llQuestions;
                } else if (module === 'lr') {
                    currentData = lrQuestions;
                } else if (module === 'teoria') { // NOVO BLOCO
                    currentData = teoriaQuestions;
                }

            // Reseta para a primeira questão
            loadQuestion(0);
        });
    });
}

/**
 * Carrega uma questão específica baseada no índice.
 * @param {number} index - O índice da questão no array de dados.
 */
function loadQuestion(index) {
    if (index < 0 || index >= currentData.length) return;
    
    currentQuestIndex = index;
    currentStepIndex = -1; // -1 significa que nenhuma etapa foi mostrada ainda
    const quest = currentData[currentQuestIndex];
    
    // Atualiza Título
    els.questTitle.textContent = quest.title;
    
    // Limpa a área de passos e mostra apenas a Gramática Original
    els.stepsContainer.innerHTML = `
        <div class="step-card">
            <div class="step-header">
                <h3 class="step-title">Gramática Original</h3>
            </div>
            <p class="step-explanation">O enigma bruto, como foi encontrado no pergaminho.</p>
            <div class="grammar-box">${quest.initialGrammar}</div>
        </div>
    `;
    
    // Reseta estado dos botões
    els.advanceBtn.disabled = false;
    els.advanceBtn.textContent = "Iniciar Ritual ✨";
    
    // Controla navegação entre questões (Anterior/Próxima)
    els.prevQuestBtn.disabled = index === 0;
    els.nextQuestBtn.disabled = index === currentData.length - 1;
}

/**
 * Avança para a próxima etapa da solução.
 * Cria o HTML dinamicamente e injeta na página.
 */
function advanceStep() {
    const quest = currentData[currentQuestIndex];
    
    // Se já terminamos, não faz nada
    if (currentStepIndex >= quest.steps.length - 1) return;
    
    currentStepIndex++;
    const step = quest.steps[currentStepIndex];
    
    // Cria o card da etapa
    const stepHtml = document.createElement('div');
    stepHtml.classList.add('step-card');
    
    // Monta o HTML interno com Título, Tooltip (!), Explicação e Resultado
    stepHtml.innerHTML = `
        <div class="step-header">
            <h3 class="step-title">${step.title}</h3>
            <div class="tooltip-container">
                <span class="info-icon">!</span>
                <span class="tooltip-text">${step.theory}</span>
            </div>
        </div>
        <p class="step-explanation">${step.explanation}</p>
        <div class="grammar-box">${step.result}</div>
    `;
    
    // Adiciona ao container
    els.stepsContainer.appendChild(stepHtml);
    
    // Scroll suave para mostrar o novo conteúdo
    stepHtml.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Verifica se acabou
    if (currentStepIndex === quest.steps.length - 1) {
        els.advanceBtn.textContent = "Enigma Concluído";
        els.advanceBtn.disabled = true;
    } else {
        els.advanceBtn.textContent = "Avançar Etapa ⬇";
    }
}

/**
 * Adiciona os ouvintes de eventos aos botões principais.
 */
function addEventListeners() {
    els.advanceBtn.addEventListener('click', advanceStep);
    
    els.resetBtn.addEventListener('click', () => {
        // Efeito visual de recarregar
        els.stepsContainer.style.opacity = '0';
        setTimeout(() => {
            loadQuestion(currentQuestIndex);
            els.stepsContainer.style.opacity = '1';
        }, 300);
    });
    
    els.prevQuestBtn.addEventListener('click', () => {
        loadQuestion(currentQuestIndex - 1);
    });
    
    els.nextQuestBtn.addEventListener('click', () => {
        loadQuestion(currentQuestIndex + 1);
    });
}

// Inicia o motor
init();