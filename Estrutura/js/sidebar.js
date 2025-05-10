/**
 * Renderiza o conteúdo HTML da sidebar no container especificado.
 */
function renderSidebar() {
    const sidebarContainer = document.getElementById('sidebar-container');
    if (!sidebarContainer) {
        console.error("Container da sidebar (#sidebar-container) não encontrado.");
        return;
    }

    // Estrutura HTML da Sidebar (baseada no original)
    sidebarContainer.innerHTML = `
        <div class="sidebar-header">
            <button id="toggle-sidebar" class="toggle-sidebar-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline> <!-- Ícone padrão para minimizar -->
                </svg>
            </button>
            <img src="https://iili.io/3RBGZox.png" alt="Logo" class="sidebar-logo">
        </div>
        <nav class="sidebar-nav">
            <div class="nav-group">
                <h2 class="nav-group-title">Menu Principal</h2>
                <a href="#" class="nav-item" data-view="dashboard">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="3" width="7" height="7"/>
                        <rect x="14" y="3" width="7" height="7"/>
                        <rect x="14" y="14" width="7" height="7"/>
                        <rect x="3" y="14" width="7" height="7"/>
                    </svg>
                    <span>Status Atendimento</span>
                </a>
                <a href="#" class="nav-item" data-view="kanban"> <!-- Adicionado active por padrão, será controlado pelo main.js -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <span>Recrutamento</span>
                </a>
                 <a href="#" class="nav-item" data-view="agenda">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                     <span>Agenda</span>
                 </a>
                 <a href="#" class="nav-item" data-view="profissionais">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/></svg>
                     <span>Profissionais</span>
                 </a>
            </div>

            <div class="nav-group">
                <h2 class="nav-group-title">Gestão</h2>
                <a href="#" class="nav-item" data-view="configuracoes"> <!-- Adicionado data-view -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                    </svg>
                    <span>Configurações</span>
                </a>
            </div>

            <div class="nav-group">
                <h2 class="nav-group-title">Suporte</h2>
                <a href="#" class="nav-item" data-view="ajuda"> <!-- Adicionado data-view -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                        <path d="M12 17h.01"/>
                    </svg>
                    <span>Ajuda</span>
                </a>
            </div>
        </nav>
    `;

    // Adiciona listeners após renderizar o HTML
    initSidebarToggle();
    initSidebarNavigation();
}

/**
 * Inicializa o botão de toggle da sidebar.
 */
function initSidebarToggle() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const toggleBtn = document.getElementById('toggle-sidebar');

    if (toggleBtn && sidebar && mainContent) {
        toggleBtn.addEventListener('click', () => {
            const isMinimized = sidebar.classList.toggle('minimized');
            mainContent.classList.toggle('minimized');
            updateSidebarToggleIcon(isMinimized); // Atualiza o ícone
        });
        // Define o estado inicial do ícone baseado na classe atual
        updateSidebarToggleIcon(sidebar.classList.contains('minimized'));
    } else {
        console.warn("Elementos da sidebar (.sidebar), conteúdo principal (.main-content) ou botão de toggle (#toggle-sidebar) não encontrados para inicializar o toggle.");
    }
}

/**
 * Atualiza o ícone do botão de toggle da sidebar.
 * @param {boolean} isMinimized - Indica se a sidebar está minimizada.
 */
function updateSidebarToggleIcon(isMinimized) {
    const toggleBtn = document.getElementById('toggle-sidebar');
    const icon = toggleBtn?.querySelector('svg polyline');
    if (icon) {
        if (isMinimized) {
            icon.setAttribute('points', '9 18 15 12 9 6'); // Ícone para expandir (>)
        } else {
            icon.setAttribute('points', '15 18 9 12 15 6'); // Ícone para minimizar (<)
        }
    }
}


/**
 * Inicializa a navegação da sidebar (troca de views).
 * Depende da função `switchView` definida em `main.js`.
 */
function initSidebarNavigation() {
    const sidebarNav = document.querySelector('.sidebar-nav');
    if (!sidebarNav) return;

    sidebarNav.addEventListener('click', (event) => {
        const navItem = event.target.closest('.nav-item');
        if (navItem && navItem.dataset.view) {
            event.preventDefault(); // Previne o comportamento padrão do link '#'
            const viewId = navItem.dataset.view;
            // Chama a função global (ou importada) para trocar a view
            if (typeof switchView === 'function') {
                switchView(viewId, navItem);
            } else {
                console.error("Função switchView não está definida ou acessível.");
            }
        }
    });
}

/**
 * Atualiza o item ativo na sidebar.
 * @param {string} viewId - O ID da view que está ativa.
 */
function setActiveNavItem(viewId) {
    const sidebarNav = document.querySelector('.sidebar-nav');
    if (!sidebarNav) return;

    sidebarNav.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.view === viewId);
    });
     console.log(`Sidebar: Item ativo definido para ${viewId}`);
}

// Inicializa a renderização e os listeners da sidebar
// A chamada inicial será feita pelo main.js após o DOM carregar.
// renderSidebar(); // Não chamar aqui, chamar no main.js
console.log("Sidebar JS carregado.");
