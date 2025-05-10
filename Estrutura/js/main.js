// Variáveis de estado globais
let currentView = APP_CONFIG.defaultView || 'kanban';
let currentTheme = localStorage.getItem('theme') || APP_CONFIG.defaultTheme || 'dark';

// --- Inicialização da Aplicação ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Carregado. Iniciando aplicação...");

    // 1. Renderizar Componentes Iniciais (Sidebar)
    if (typeof renderSidebar === 'function') {
        renderSidebar();
    } else {
        console.error("Função renderSidebar não encontrada.");
    }

    // 2. Definir Tema Inicial
    setTheme(currentTheme);
    initThemeToggle(); // Inicializa os botões de toggle de tema

    // 3. Carregar View Inicial
    // A função switchView agora também renderiza o HTML da view
    if (typeof switchView === 'function') {
        switchView(currentView); // Carrega a view padrão definida em APP_CONFIG
    } else {
        console.error("Função switchView não encontrada.");
    }

    // 4. Inicializar Modais Globais (se houver)
    // initGlobalModals(); // Exemplo: se houver modais não específicos de uma view

    // 5. Adicionar Listener de Resize para Responsividade
    handleResize(); // Chama uma vez para ajustar no carregamento
    window.addEventListener('resize', handleResize);

    console.log("Aplicação inicializada.");
});

// --- Troca de Tema (Light/Dark) ---
function setTheme(theme) {
    document.body.classList.toggle("dark", theme === 'dark');
    currentTheme = theme;
    localStorage.setItem('theme', theme);
    updateThemeToggleButtons(theme); // Atualiza ícones dos botões
    console.log(`Tema definido para: ${theme}`);
}

function initThemeToggle() {
    // Listener genérico para qualquer botão de toggle de tema
    document.body.addEventListener('click', (event) => {
        const toggleButton = event.target.closest('.theme-toggle-btn');
        if (toggleButton) {
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
        }
    });
    // Garante que os ícones estejam corretos no carregamento inicial
    updateThemeToggleButtons(currentTheme);
}

function updateThemeToggleButtons(theme) {
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
        const icon = btn.querySelector('i'); // Assume Font Awesome <i>
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        // Adicionar lógica para SVG se necessário
    });
}

// --- Troca de Views ---
/**
 * Carrega e exibe a view solicitada no container principal.
 * @param {string} viewId - O ID da view a ser carregada (ex: 'kanban', 'dashboard').
 * @param {HTMLElement | null} navElement - O elemento do menu clicado (opcional, para destacar).
 */
async function switchView(viewId, navElement = null) {
    console.log(`Tentando trocar para view: ${viewId}`);
    const viewPlaceholder = document.getElementById('view-placeholder');
    if (!viewPlaceholder) {
        console.error("Container #view-placeholder não encontrado.");
        return;
    }

    // Limpa o conteúdo anterior
    viewPlaceholder.innerHTML = '<div class="content-placeholder">Carregando...</div>'; // Feedback visual

    // Atualiza o item ativo na sidebar (se a função existir)
    if (typeof setActiveNavItem === 'function') {
        setActiveNavItem(viewId);
    }

    // Carrega o conteúdo e inicializa a lógica da view específica
    try {
        switch (viewId) {
            case 'kanban':
                if (typeof renderKanbanView === 'function') {
                    viewPlaceholder.innerHTML = getKanbanViewHTML(); // Pega o HTML da view
                    await renderKanbanView(); // Chama a função de inicialização/renderização do kanban.js
                } else { throw new Error("Função renderKanbanView não encontrada."); }
                break;
            case 'dashboard': // Corresponde ao 'Status Atendimento'
                 if (typeof renderStatusPanelView === 'function') {
                    viewPlaceholder.innerHTML = getStatusPanelViewHTML(); // Pega o HTML da view
                    await renderStatusPanelView(); // Chama a função de inicialização/renderização do status-panel.js
                 } else { throw new Error("Função renderStatusPanelView não encontrada."); }
                break;
            case 'agenda':
                 viewPlaceholder.innerHTML = getGenericViewHTML('Agenda', 'Conteúdo da Agenda em breve...');
                 // initAgendaView(); // Se houver lógica específica
                 break;
            case 'profissionais':
                 viewPlaceholder.innerHTML = getGenericViewHTML('Profissionais', 'Conteúdo de Profissionais em breve...');
                 // initProfissionaisView(); // Se houver lógica específica
                 break;
            case 'configuracoes':
                 viewPlaceholder.innerHTML = getGenericViewHTML('Configurações', 'Conteúdo de Configurações em breve...');
                 // initConfiguracoesView(); // Se houver lógica específica
                 break;
            case 'ajuda':
                 viewPlaceholder.innerHTML = getGenericViewHTML('Ajuda', 'Conteúdo de Ajuda em breve...');
                 // initAjudaView(); // Se houver lógica específica
                 break;
            default:
                console.warn(`View desconhecida: ${viewId}. Carregando view padrão.`);
                viewPlaceholder.innerHTML = getGenericViewHTML('Erro', `View "${viewId}" não encontrada.`);
                // Poderia carregar a view padrão aqui também
                // if (typeof renderKanbanView === 'function') {
                //     viewPlaceholder.innerHTML = getKanbanViewHTML();
                //     await renderKanbanView();
                //     setActiveNavItem('kanban'); // Atualiza nav item para o padrão
                // }
                viewId = null; // Reseta viewId para não atualizar currentView incorretamente
        }
        if (viewId) {
            currentView = viewId;
            console.log(`View ${currentView} carregada com sucesso.`);
            // Garante que os botões de tema na nova view funcionem
            updateThemeToggleButtons(currentTheme);
        }
    } catch (error) {
        console.error(`Erro ao carregar a view ${viewId}:`, error);
        viewPlaceholder.innerHTML = `<div class="content-placeholder">Erro ao carregar a view: ${error.message}</div>`;
        // Poderia tentar carregar uma view padrão segura aqui
    }
}

/**
 * Gera HTML para views genéricas/placeholders.
 * @param {string} title - Título da view.
 * @param {string} content - Conteúdo placeholder.
 * @returns {string} HTML da view genérica.
 */
function getGenericViewHTML(title, content) {
    // Inclui um header básico e o placeholder
    // Adapte conforme necessário se as views genéricas precisarem de mais estrutura
    return `
        <div class="view-container active" style="display: flex; flex-direction: column; height: 100%;">
            <div class="header">
              <div class="header-main"><h1 class="header-title">${title}</h1></div>
              <div class="header-actions">
                 <button class="theme-toggle-btn" title="Alternar Tema">
                     <i class="fas ${currentTheme === 'dark' ? 'fa-sun' : 'fa-moon'}"></i>
                 </button>
                 <!-- Outros botões genéricos se necessário -->
              </div>
            </div>
            <div style="padding: var(--spacing-lg); flex-grow: 1; overflow-y: auto;">
                <div class="content-placeholder">${content}</div>
            </div>
        </div>
    `;
}


// --- Funções de Responsividade ---
function handleResize() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    if (!sidebar || !mainContent) return;

    // Minimiza automaticamente em telas menores (ex: <= 1024px)
    const shouldBeMinimized = window.innerWidth <= 1024;
    const isMinimized = sidebar.classList.contains('minimized');

    if (shouldBeMinimized && !isMinimized) {
         sidebar.classList.add('minimized');
         mainContent.classList.add('minimized');
         updateSidebarToggleIcon(true); // Atualiza ícone
         console.log("Sidebar minimizada automaticamente.");
    }
    // Opcional: Desminimizar automaticamente em telas maiores (removido para manter estado do usuário)
    // else if (!shouldBeMinimized && isMinimized) {
    //      sidebar.classList.remove('minimized');
    //      mainContent.classList.remove('minimized');
    //      updateSidebarToggleIcon(false); // Atualiza ícone
    //      console.log("Sidebar restaurada automaticamente.");
    // }
}

console.log("Main JS carregado.");
