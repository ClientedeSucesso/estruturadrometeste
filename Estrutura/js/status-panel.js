// Variáveis específicas do Painel de Status
let statusPanelEmpresaAtual = STATUS_PANEL_CONFIG.empresas[STATUS_PANEL_CONFIG.empresaPadrao] || Object.values(STATUS_PANEL_CONFIG.empresas)[0];
let statusPanelNomeEmpresa = statusPanelEmpresaAtual.nome;
// let statusPanelWebhookUrl = statusPanelEmpresaAtual.webhookUrl; // Mover para backend
let statusPanelIsLoading = false;
let statusPanelIsSending = false;
let statusPanelIsClearing = false;
let statusPanelTableData = []; // Dados da tabela principal
let statusPanelInputTableData = []; // Dados da tabela editável no sheet
let statusPanelCurrentFilter = "all";
let statusPanelSearchTerm = "";

/**
 * Retorna o HTML base para a view do Painel de Status.
 */
function getStatusPanelViewHTML() {
    // Adapta a estrutura original, usando IDs específicos com prefixo/sufixo se necessário
    // para evitar conflitos com outras views (ex: 'statusPanelSearchInput')
    return `
        <div class="dashboard-container view-container active"> <!-- Adiciona active aqui -->
            <div class="header"> <!-- Header específico para esta view -->
                <div class="header-main">
                    <h1 class="header-title">Painel Status</h1>
                </div>
                <div class="header-controls" style="margin: 0 auto;">
                    <div class="dropdown">
                        <button class="dropdown-toggle" id="statusPanelEmpresaDropdownToggle">
                            <span id="statusPanelCurrentEmpresa">${statusPanelNomeEmpresa}</span>
                            <svg class="icon" viewBox="0 0 24 24" style="width:16px; height:16px;"> <polyline points="6 9 12 15 18 9"></polyline> </svg>
                        </button>
                        <div class="dropdown-menu" id="statusPanelEmpresaDropdownMenu">
                            <!-- Opções carregadas pelo JS -->
                        </div>
                    </div>
                </div>
                <div class="header-actions">
                     <span class="icon-btn" id="statusPanelAddProfessionalBtn" title="Adicionar Profissional" style="color: var(--kanban-text-secondary); cursor: pointer; padding: 0.5rem;">
                         <svg class="icon" viewBox="0 0 24 24" style="width:20px; height:20px;"> <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path> <circle cx="8.5" cy="7" r="4"></circle> <line x1="20" y1="8" x2="20" y2="14"></line> <line x1="23" y1="11" x2="17" y2="11"></line> </svg>
                     </span>
                     <button class="btn btn-primary btn-sm" id="statusPanelOpenDataSheetBtn">
                         <svg class="icon" viewBox="0 0 24 24" style="width:16px; height:16px;"> <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect> <line x1="3" y1="9" x2="21" y2="9"></line> <line x1="3" y1="15" x2="21" y2="15"></line> <line x1="9" y1="9" x2="9" y2="21"></line> </svg>
                         Dados
                     </button>
                     <button class="btn btn-accent btn-sm" id="statusPanelSendAttendanceBtn">
                         <svg class="icon" viewBox="0 0 24 24" style="width:16px; height:16px;"> <line x1="22" y1="2" x2="11" y2="13"></line> <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon> </svg>
                         Enviar
                     </button>
                     <button class="theme-toggle-btn" title="Alternar Tema">
                         <i class="fas fa-moon"></i>
                     </button>
                </div>
            </div>
            <!-- Conteúdo principal do painel-mult-testes (integrado) -->
            <div class="container" style="flex: 1; overflow: hidden; display: flex; padding: var(--spacing-lg);">
                <div class="status-table-section" style="margin: 0; border-radius: var(--border-radius); flex: 1;">
                    <div class="status-table-header">
                        <div class="status-title">
                            <svg class="icon status-icon" viewBox="0 0 24 24" style="width:24px; height:24px; color: var(--success-color);"> <path d="M9 11l3 3L22 4"></path> <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path> </svg>
                            Status de Confirmação
                        </div>
                        <div class="status-controls">
                            <div class="search-wrapper">
                                <svg class="icon search-icon" viewBox="0 0 24 24" style="width:16px; height:16px;"> <circle cx="11" cy="11" r="8"></circle> <line x1="21" y1="21" x2="16.65" y2="16.65"></line> </svg>
                                <input type="search" class="search-input" id="statusPanelSearchInput" placeholder="Buscar Cliente/Profissional...">
                                <!-- Botão de filtro (dropdown será populado via JS) -->
                                <button class="btn btn-outline btn-icon-only" id="statusPanelFilterDropdownToggle" style="position: absolute; right: 0; top: 50%; transform: translateY(-50%); border: none; background: transparent; padding: 0.5rem;">
                                    <svg class="icon" viewBox="0 0 24 24" style="width:16px; height:16px;"> <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon> </svg>
                                </button>
                                <div class="dropdown-menu" id="statusPanelFilterDropdownMenu" style="right: 40px;"> <!-- Ajusta posição -->
                                    <!-- Opções carregadas pelo JS -->
                                    <div class="dropdown-item active" data-filter="all"><span class="dropdown-item-check">✓</span>Todos</div>
                                    <div class="dropdown-item" data-filter="aguardando"><span class="dropdown-item-check"></span>Aguardando</div>
                                    <div class="dropdown-item" data-filter="confirmado"><span class="dropdown-item-check"></span>Confirmado</div>
                                    <div class="dropdown-item" data-filter="cancelado"><span class="dropdown-item-check"></span>Cancelado</div>
                                    <div class="dropdown-item" data-filter="bom dia ☀️"><span class="dropdown-item-check"></span>Bom dia ☀️</div>
                                    <div class="dropdown-item" data-filter="em execução"><span class="dropdown-item-check"></span>Em Execução</div>
                                    <div class="dropdown-item" data-filter="enviar"><span class="dropdown-item-check"></span>Enviar</div>
                                </div>
                            </div>
                            <button class="btn btn-outline btn-icon-only" id="statusPanelRefreshBtn" title="Atualizar Dados">
                                <svg class="icon" viewBox="0 0 24 24" style="width:16px; height:16px;"> <path d="M23 4v6h-6M1 20v-6h6"></path> <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path> </svg>
                            </button>
                        </div>
                    </div>
                    <div class="table-container">
                        <div class="scroll-area">
                            <table id="statusPanelTable">
                                <thead>
                                    <tr>
                                        <th class="text-center" style="width: 50px;">#</th>
                                        <th class="text-center" style="width: 120px;">Data</th>
                                        <th>Cliente</th>
                                        <th>Profissional</th>
                                        <th class="text-center" style="width: 180px;">Status</th>
                                    </tr>
                                </thead>
                                <tbody id="statusPanelTableBody">
                                    <!-- Linhas carregadas pelo JS -->
                                    <tr><td colspan="5"><div class="empty-state"><p>Carregando dados...</p></div></td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modals/Sheets específicos do Painel de Status -->
        ${getStatusPanelModalsHTML()}
    `;
}

/**
 * Retorna o HTML para os modais/sheets usados na view do Painel de Status.
 */
function getStatusPanelModalsHTML() {
    return `
        <!-- Sheet de Dados -->
        <div class="modal-backdrop" id="statusPanelSheetBackdrop"></div>
        <div class="sheet" id="statusPanelDataSheet">
            <div class="sheet-header">
                <button class="sheet-close" id="statusPanelCancelSheetBtn">
                    <svg class="icon" viewBox="0 0 24 24" style="width:20px; height:20px;"> <line x1="18" y1="6" x2="6" y2="18"></line> <line x1="6" y1="6" x2="18" y2="18"></line> </svg>
                </button>
                <div class="sheet-actions">
                    <button class="btn btn-danger btn-sm" id="statusPanelClearDataBtn">
                        <svg class="icon" viewBox="0 0 24 24" style="width:16px; height:16px;"> <polyline points="3 6 5 6 21 6"></polyline> <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path> <line x1="10" y1="11" x2="10" y2="17"></line> <line x1="14" y1="11" x2="14" y2="17"></line> </svg>
                        Limpar Tabela
                    </button>
                    <button class="btn btn-accent btn-sm" id="statusPanelAddDataBtn">
                        <svg class="icon" viewBox="0 0 24 24" style="width:16px; height:16px;"> <line x1="12" y1="5" x2="12" y2="19"></line> <line x1="5" y1="12" x2="19" y2="12"></line> </svg>
                        Adicionar Dados
                    </button>
                    <button class="btn btn-info btn-sm" id="statusPanelAddNewRowBtn">
                        <svg class="icon" viewBox="0 0 24 24" style="width:16px; height:16px;"> <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path> <circle cx="8.5" cy="7" r="4"></circle> <line x1="20" y1="8" x2="20" y2="14"></line> <line x1="23" y1="11" x2="17" y2="11"></line> </svg>
                        Nova Linha
                    </button>
                    <button class="btn btn-warning btn-sm" id="statusPanelUpdateDataBtn">
                        <svg class="icon" viewBox="0 0 24 24" style="width:16px; height:16px;"> <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path> <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path> </svg>
                        Salvar Alterações
                    </button>
                    <div class="search-wrapper" style="margin-left: var(--spacing-md);">
                        <svg class="icon search-icon" viewBox="0 0 24 24" style="width:16px; height:16px;"> <circle cx="11" cy="11" r="8"></circle> <line x1="21" y1="21" x2="16.65" y2="16.65"></line> </svg>
                        <input type="search" class="search-input" id="statusPanelTableSearchInput" placeholder="Buscar na tabela..." style="width: 200px;">
                    </div>
                </div>
            </div>
            <div class="tabs">
                <!-- Abas Tabela/Input -->
                 <div class="tabs-list">
                     <div class="tab-trigger active" data-tab="table">Tabela Editável</div>
                     <div class="tab-trigger" data-tab="input">Entrada de Dados (Colar)</div>
                 </div>
                <div class="tab-content active" id="tableTab">
                    <div class="table-container">
                        <div class="scroll-area">
                            <table id="statusPanelInputTable">
                                <thead> <tr> <th class="text-center">Carregando dados...</th> </tr> </thead>
                                <tbody id="statusPanelInputTableBody"> <tr> <td colspan="${STATUS_PANEL_CONFIG.displayTableHeaders.length}" class="text-center"> <p style="color: var(--gray-text);">Nenhum dado carregado.</p> </td> </tr> </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                 <div class="tab-content" id="inputTab">
                     <div style="padding: 1rem 0;">
                         <textarea class="textarea" id="statusPanelDataInput" rows="10" style="width: 100%;" placeholder="Cole os dados da planilha aqui (formato esperado: ${STATUS_PANEL_CONFIG.expectedDbHeaders.slice(0, 11).join(', ')})..."></textarea>
                         <p style="font-size: 0.8rem; color: var(--gray-text); margin-top: 0.5rem;">Cole os dados copiados de uma planilha (Excel, Google Sheets). Certifique-se de que as colunas estejam na ordem correta. O status será definido como 'ENVIAR' por padrão.</p>
                     </div>
                 </div>
            </div>
        </div>

        <!-- Modal de Confirmação de Limpeza -->
        <div class="modal-backdrop" id="statusPanelConfirmClearBackdrop"></div>
        <div class="sheet" id="statusPanelConfirmClearModal" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); bottom: auto; height: auto; display: none; width: 90%; max-width: 450px; padding: var(--spacing-lg);">
            <div class="sheet-header" style="margin-bottom: var(--spacing-md);">
                <h2 class="sheet-title" style="color: var(--danger-color);">Confirmar Limpeza</h2>
                <button class="sheet-close" onclick="closeStatusPanelModal('statusPanelConfirmClearModal')">
                    <svg class="icon" viewBox="0 0 24 24" style="width:20px; height:20px;"> <line x1="18" y1="6" x2="6" y2="18"></line> <line x1="6" y1="6" x2="18" y2="18"></line> </svg>
                </button>
            </div>
            <p class="sheet-description">Tem certeza que deseja limpar TODOS os dados da tabela <strong id="confirmClearTableName"></strong>? Esta ação não pode ser desfeita.</p>
            <div class="modal-footer" style="margin-top: 1.5rem; display: flex; justify-content: flex-end; gap: 1rem;">
                <button class="btn btn-outline btn-sm" onclick="closeStatusPanelModal('statusPanelConfirmClearModal')">Cancelar</button>
                <button class="btn btn-danger btn-sm" id="statusPanelConfirmClearBtn">
                    <svg class="icon" viewBox="0 0 24 24" style="width:16px; height:16px;"> <polyline points="3 6 5 6 21 6"></polyline> <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path> <line x1="10" y1="11" x2="10" y2="17"></line> <line x1="14" y1="11" x2="14" y2="17"></line> </svg>
                    Sim, Limpar Tudo
                </button>
            </div>
        </div>

        <!-- Modal Adicionar Profissional -->
        <div class="modal-backdrop" id="statusPanelAddProfessionalBackdrop"></div>
        <div class="sheet" id="statusPanelAddProfessionalModal" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); bottom: auto; height: auto; display: none; width: 90%; max-width: 450px; padding: var(--spacing-lg);">
            <div class="sheet-header">
                <h2 class="sheet-title">Adicionar Profissional</h2>
                <button class="sheet-close" id="statusPanelCloseAddProfessionalBtn">
                    <svg class="icon" viewBox="0 0 24 24" style="width:20px; height:20px;"> <line x1="18" y1="6" x2="6" y2="18"></line> <line x1="6" y1="6" x2="18" y2="18"></line> </svg>
                </button>
            </div>
            <div class="sheet-content">
                <div class="form-group">
                    <label for="statusPanelProfessionalName" class="form-label">Nome</label>
                    <input type="text" id="statusPanelProfessionalName" class="input" placeholder="Digite o nome do profissional" required>
                </div>
                <div class="form-group">
                    <label for="statusPanelProfessionalWhatsapp" class="form-label">Whatsapp</label>
                    <input type="tel" id="statusPanelProfessionalWhatsapp" class="input" placeholder="Digite o número (ex: 5511987654321)" required>
                </div>
            </div>
            <div class="sheet-actions" style="margin-top: var(--spacing-lg); display: flex; justify-content: flex-end; gap: 1rem;">
                <button class="btn btn-outline btn-sm" id="statusPanelCancelAddProfessionalBtn">Cancelar</button>
                <button class="btn btn-primary btn-sm" id="statusPanelSaveProfessionalBtn">
                    <svg class="icon" viewBox="0 0 24 24" style="width:16px; height:16px;"> <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path> <polyline points="17 21 17 13 7 13 7 21"></polyline> <polyline points="7 3 7 8 15 8"></polyline> </svg>
                    Salvar
                </button>
            </div>
        </div>
    `;
}

/**
 * Renderiza e inicializa a view do Painel de Status.
 */
async function renderStatusPanelView() {
    console.log("Renderizando Status Panel View...");
    // Adiciona listeners específicos do Painel de Status
    initStatusPanelListeners();
    // Configura o dropdown de empresas
    setupStatusPanelEmpresaDropdown();
    // Carrega os dados iniciais da tabela principal
    await fetchStatusPanelData();
    console.log("Status Panel View renderizada e inicializada.");
}

/**
 * Inicializa os listeners para os elementos do Painel de Status.
 */
function initStatusPanelListeners() {
    console.log("Inicializando listeners do Painel de Status...");

    // Listeners do Header da View
    const searchInput = document.getElementById("statusPanelSearchInput");
    const filterDropdownToggle = document.getElementById("statusPanelFilterDropdownToggle");
    const filterDropdownMenu = document.getElementById("statusPanelFilterDropdownMenu");
    const refreshBtn = document.getElementById("statusPanelRefreshBtn");
    const openDataSheetBtn = document.getElementById("statusPanelOpenDataSheetBtn");
    const sendAttendanceBtn = document.getElementById("statusPanelSendAttendanceBtn");
    const addProfessionalBtn = document.getElementById("statusPanelAddProfessionalBtn");

    searchInput?.addEventListener("input", (e) => {
        statusPanelSearchTerm = e.target.value;
        renderStatusPanelTable();
    });

    filterDropdownToggle?.addEventListener("click", (e) => {
        e.stopPropagation();
        filterDropdownMenu?.classList.toggle("show");
    });

    // Listener global para fechar dropdowns
    document.addEventListener("click", (e) => {
        if (filterDropdownMenu && !filterDropdownToggle?.contains(e.target)) {
            filterDropdownMenu.classList.remove("show");
        }
        const empresaDropdownMenu = document.getElementById("statusPanelEmpresaDropdownMenu");
        const empresaDropdownToggle = document.getElementById("statusPanelEmpresaDropdownToggle");
        if (empresaDropdownMenu && empresaDropdownToggle && !empresaDropdownToggle.contains(e.target)) {
             empresaDropdownMenu.classList.remove("show");
        }
    });

    filterDropdownMenu?.addEventListener("click", (e) => {
        const item = e.target.closest(".dropdown-item");
        if (item && item.dataset.filter) {
            e.stopPropagation();
            statusPanelCurrentFilter = item.dataset.filter;
            filterDropdownMenu.querySelectorAll(".dropdown-item").forEach(i => {
                i.classList.remove("active");
                i.querySelector('.dropdown-item-check').textContent = '';
            });
            item.classList.add("active");
            item.querySelector('.dropdown-item-check').textContent = '✓';
            filterDropdownMenu.classList.remove("show");
            renderStatusPanelTable();
        }
    });


    refreshBtn?.addEventListener("click", fetchStatusPanelData);
    openDataSheetBtn?.addEventListener("click", openStatusPanelDataSheet);
    sendAttendanceBtn?.addEventListener("click", handleStatusPanelSend);
    addProfessionalBtn?.addEventListener("click", openStatusPanelAddProfessionalModal);

    // Listeners para elementos dentro do #statusPanelDataSheet
    const dataSheet = document.getElementById("statusPanelDataSheet");
    if (dataSheet) {
        const clearDataBtn = dataSheet.querySelector("#statusPanelClearDataBtn");
        const sheetBackdrop = document.getElementById("statusPanelSheetBackdrop");
        const cancelSheetBtn = dataSheet.querySelector("#statusPanelCancelSheetBtn");
        const addDataBtn = dataSheet.querySelector("#statusPanelAddDataBtn");
        const updateDataBtn = dataSheet.querySelector("#statusPanelUpdateDataBtn");
        const addNewRowBtn = dataSheet.querySelector("#statusPanelAddNewRowBtn");
        const inputTableBody = dataSheet.querySelector("#statusPanelInputTableBody");
        const tableSearchInput = dataSheet.querySelector("#statusPanelTableSearchInput");
        const dataInputArea = dataSheet.querySelector("#statusPanelDataInput");

        clearDataBtn?.addEventListener("click", handleStatusPanelClear);
        sheetBackdrop?.addEventListener("click", closeStatusPanelDataSheet);
        cancelSheetBtn?.addEventListener("click", closeStatusPanelDataSheet);
        addDataBtn?.addEventListener("click", handleStatusPanelAddData);
        updateDataBtn?.addEventListener("click", handleStatusPanelUpdate);
        addNewRowBtn?.addEventListener("click", addNewStatusPanelRow);

        inputTableBody?.addEventListener("click", (e) => {
            if (e.target.closest("[data-action='delete']")) {
                const row = e.target.closest("tr");
                if (row && row.dataset.index) {
                    removeStatusPanelInputRow(parseInt(row.dataset.index));
                }
            }
        });

        inputTableBody?.addEventListener("change", (e) => {
            const input = e.target.closest("input.input-sm");
            if (input && input.dataset.header) {
                const row = input.closest("tr");
                if (row && row.dataset.index) {
                    updateStatusPanelInputTableData(
                        parseInt(row.dataset.index),
                        input.dataset.header,
                        input.value
                    );
                }
            }
        });

        tableSearchInput?.addEventListener('input', function() {
            const searchText = this.value.toLowerCase();
            const rows = dataSheet.querySelectorAll('#statusPanelInputTableBody tr');
            rows.forEach(row => {
                let found = false;
                const inputs = row.querySelectorAll('input.input-sm');
                inputs.forEach(input => {
                    if (input.value.toLowerCase().includes(searchText)) { found = true; }
                });
                row.style.display = found ? '' : 'none';
            });
        });

        // Inicializa abas dentro do sheet
        initStatusPanelSheetTabs();

    } else {
        console.warn("Elemento #statusPanelDataSheet não encontrado para adicionar listeners internos.");
    }

    // Listeners para modal de adicionar profissional
    const addProfModal = document.getElementById("statusPanelAddProfessionalModal");
    if (addProfModal) {
        const backdrop = document.getElementById("statusPanelAddProfessionalBackdrop");
        const closeBtn = addProfModal.querySelector("#statusPanelCloseAddProfessionalBtn");
        const cancelBtn = addProfModal.querySelector("#statusPanelCancelAddProfessionalBtn");
        const saveBtn = addProfModal.querySelector("#statusPanelSaveProfessionalBtn");

        backdrop?.addEventListener("click", () => closeStatusPanelModal('statusPanelAddProfessionalModal'));
        closeBtn?.addEventListener("click", () => closeStatusPanelModal('statusPanelAddProfessionalModal'));
        cancelBtn?.addEventListener("click", () => closeStatusPanelModal('statusPanelAddProfessionalModal'));
        saveBtn?.addEventListener("click", saveStatusPanelProfessional);
    } else {
         console.warn("Elemento #statusPanelAddProfessionalModal não encontrado.");
    }

     // Listener para modal de confirmação de limpeza
     const confirmClearModal = document.getElementById("statusPanelConfirmClearModal");
     if (confirmClearModal) {
         const backdrop = document.getElementById("statusPanelConfirmClearBackdrop");
         const closeBtn = confirmClearModal.querySelector(".sheet-close");
         const cancelBtn = confirmClearModal.querySelector(".btn-outline");
         const confirmBtn = confirmClearModal.querySelector("#statusPanelConfirmClearBtn");

         backdrop?.addEventListener("click", () => closeStatusPanelModal('statusPanelConfirmClearModal'));
         closeBtn?.addEventListener("click", () => closeStatusPanelModal('statusPanelConfirmClearModal'));
         cancelBtn?.addEventListener("click", () => closeStatusPanelModal('statusPanelConfirmClearModal'));
         confirmBtn?.addEventListener("click", proceedWithStatusPanelClear);
     } else {
          console.warn("Elemento #statusPanelConfirmClearModal não encontrado.");
     }
}

/**
 * Configura o dropdown de seleção de empresa para o Painel de Status.
 */
function setupStatusPanelEmpresaDropdown() {
    const empresaDropdownMenu = document.getElementById("statusPanelEmpresaDropdownMenu");
    const empresaDropdownToggle = document.getElementById("statusPanelEmpresaDropdownToggle");
    const currentEmpresaSpan = document.getElementById("statusPanelCurrentEmpresa");

    if (!empresaDropdownMenu || !empresaDropdownToggle || !currentEmpresaSpan) {
        console.warn("Elementos do dropdown de empresa do painel não encontrados.");
        return;
    }

    // Limpa opções existentes e popula com base na config
    empresaDropdownMenu.innerHTML = '';
    const empresas = STATUS_PANEL_CONFIG.empresas || {};
    const empresaPadraoId = STATUS_PANEL_CONFIG.empresaPadrao;

    Object.entries(empresas).forEach(([id, config]) => {
        const isActive = id === empresaPadraoId;
        const item = document.createElement('div');
        item.className = `dropdown-item ${isActive ? 'active' : ''}`;
        item.dataset.empresaId = id; // Usa um nome de dataset claro
        item.innerHTML = `
            <span class="dropdown-item-check">${isActive ? '✓' : ''}</span>
            ${config.nome || id}
        `;
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            changeStatusPanelEmpresa(id);
            empresaDropdownMenu.classList.remove("show");
        });
        empresaDropdownMenu.appendChild(item);
    });

    // Define o nome da empresa atual no botão
    currentEmpresaSpan.textContent = statusPanelNomeEmpresa;

    // Adiciona listener ao botão toggle
    empresaDropdownToggle.replaceWith(empresaDropdownToggle.cloneNode(true)); // Remove listeners antigos
    document.getElementById("statusPanelEmpresaDropdownToggle")?.addEventListener("click", (e) => {
        e.stopPropagation();
        empresaDropdownMenu.classList.toggle("show");
    });
}

/**
 * Altera a empresa ativa no Painel de Status e recarrega os dados.
 * @param {string} empresaId - O ID da empresa selecionada.
 */
async function changeStatusPanelEmpresa(empresaId) {
    const config = STATUS_PANEL_CONFIG.empresas[empresaId];
    if (!config) {
        console.error(`Configuração não encontrada para empresa ID: ${empresaId}`);
        return;
    }

    statusPanelEmpresaAtual = config;
    statusPanelNomeEmpresa = config.nome;
    // statusPanelWebhookUrl = config.webhookUrl; // Mover para backend

    // Atualiza UI do dropdown
    document.querySelectorAll("#statusPanelEmpresaDropdownMenu .dropdown-item").forEach(item => {
        const isActive = item.dataset.empresaId === empresaId;
        item.classList.toggle("active", isActive);
        item.querySelector('.dropdown-item-check').textContent = isActive ? '✓' : '';
    });
    document.getElementById("statusPanelCurrentEmpresa").textContent = config.nome;

    // Recarrega dados da nova empresa
    await fetchStatusPanelData();
    showToast("Sucesso", `Painel de Status alterado para ${config.nome}`);
}


/**
 * Busca os dados da tabela principal do Painel de Status no Supabase.
 */
async function fetchStatusPanelData() {
    if (currentView !== 'dashboard') return; // Só busca se a view estiver ativa
    showStatusPanelLoadingState();
    statusPanelIsLoading = true;
    updateStatusPanelRefreshButton();

    try {
        const tableName = statusPanelEmpresaAtual.tableName;
        if (!tableName) throw new Error("Nome da tabela não definido para a empresa atual.");

        console.log(`Buscando dados do Painel de Status da tabela: ${tableName}`);
        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .order('DATA', { ascending: false }); // Ordena por data descendente

        if (error) throw error;

        statusPanelTableData = data || [];
        console.log(`${statusPanelTableData.length} registros carregados para o Painel de Status.`);
        renderStatusPanelTable();
    } catch (error) {
        console.error("Erro fetchStatusPanelData:", error);
        showToast("Erro", `Falha ao carregar dados do painel: ${error.message}`, "error");
        showStatusPanelEmptyState("Erro ao carregar dados");
    } finally {
        statusPanelIsLoading = false;
        updateStatusPanelRefreshButton();
    }
}

/**
 * Busca os dados para a tabela editável no sheet do Painel de Status.
 */
async function fetchDataForStatusPanelSheet() {
    const inputTableBody = document.getElementById("statusPanelInputTableBody");
    if (!inputTableBody) return false;
    inputTableBody.innerHTML = `<tr><td colspan="${STATUS_PANEL_CONFIG.displayTableHeaders.length}" class="text-center"><p style="color: var(--gray-text);"><svg class="icon icon-spin" style="width:20px;height:20px;vertical-align:middle;margin-right:5px;" viewBox="0 0 24 24"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>Carregando dados...</p></td></tr>`;

    try {
        const tableName = statusPanelEmpresaAtual.tableName;
        if (!tableName) throw new Error("Nome da tabela não definido para a empresa atual.");

        console.log(`Buscando dados para o sheet da tabela: ${tableName}`);
        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .order('DATA', { ascending: false });

        if (error) throw error;

        statusPanelInputTableData = data || [];
        console.log(`${statusPanelInputTableData.length} registros carregados para o sheet.`);
        renderStatusPanelInputTable();
        return true;
    } catch (error) {
        console.error("Erro fetchDataForStatusPanelSheet:", error);
        showToast("Erro", `Falha ao carregar dados para edição: ${error.message}`, "error");
        inputTableBody.innerHTML = `<tr><td colspan="${STATUS_PANEL_CONFIG.displayTableHeaders.length}" class="text-center"><p style="color: var(--danger-color);">Falha ao carregar dados.</p></td></tr>`;
        return false;
    }
}

/**
 * Exibe o estado de carregamento na tabela principal do Painel de Status.
 */
function showStatusPanelLoadingState() {
    const tableBody = document.getElementById("statusPanelTableBody");
    if (tableBody) {
        tableBody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><svg class="icon icon-spin empty-state-icon" style="width:32px;height:32px" viewBox="0 0 24 24"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg><p>Carregando...</p></div></td></tr>`;
    }
}

/**
 * Exibe o estado vazio na tabela principal do Painel de Status.
 * @param {string} message - Mensagem a ser exibida.
 */
function showStatusPanelEmptyState(message = "Nenhum registro.") {
    const tableBody = document.getElementById("statusPanelTableBody");
     if (tableBody) {
        tableBody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><svg class="icon empty-state-icon" style="width:32px;height:32px" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg><p>${message}</p></div></td></tr>`;
    }
}

/**
 * Atualiza o estado visual do botão de refresh do Painel de Status.
 */
function updateStatusPanelRefreshButton() {
    const refreshBtn = document.getElementById("statusPanelRefreshBtn");
    if (!refreshBtn) return;
    const icon = refreshBtn.querySelector('.icon');
    if (statusPanelIsLoading) {
        icon?.classList.add('icon-spin');
        refreshBtn.disabled = true;
        refreshBtn.title = 'Atualizando...';
    } else {
        icon?.classList.remove('icon-spin');
        refreshBtn.disabled = false;
        refreshBtn.title = 'Atualizar Dados';
    }
}

/**
 * Renderiza a tabela principal do Painel de Status com base nos dados filtrados.
 */
function renderStatusPanelTable() {
    const filteredData = statusPanelTableData.filter(item =>
        (statusPanelCurrentFilter === 'all' || (item.STATUS && item.STATUS.toLowerCase() === statusPanelCurrentFilter.toLowerCase())) &&
        (!statusPanelSearchTerm ||
         (item.CLIENTE && item.CLIENTE.toLowerCase().includes(statusPanelSearchTerm.toLowerCase())) ||
         (item.PROFISSIONAL && item.PROFISSIONAL.toLowerCase().includes(statusPanelSearchTerm.toLowerCase())))
    );

    const tableBody = document.getElementById("statusPanelTableBody");
    if (!tableBody) return;

    if (filteredData.length > 0) {
        tableBody.innerHTML = filteredData.map((item, index) => `
            <tr data-row-id="${item.id}"> <!-- Adiciona ID da linha -->
                <td class="text-center">${index + 1}</td>
                <td class="text-center">${formatDate(item.DATA)}</td> <!-- Usa formatDate de utils.js -->
                <td>${formatClientNameStatus(item.CLIENTE)}</td> <!-- Usa formatador específico -->
                <td>${item.PROFISSIONAL || ''}</td>
                <td class="text-center">${getStatusPanelBadgeHtml(item)}</td>
            </tr>`).join('');
        // Adiciona listeners aos botões de enviar confirmação após renderizar
        addSendConfirmationListeners();
    } else {
        showStatusPanelEmptyState(statusPanelSearchTerm || statusPanelCurrentFilter !== 'all' ? "Nenhum registro corresponde aos filtros." : "Nenhum registro encontrado.");
    }
}

/**
 * Adiciona listeners aos botões "Enviar Confirmação Cliente" na tabela principal.
 */
function addSendConfirmationListeners() {
    const tableBody = document.getElementById("statusPanelTableBody");
    if (!tableBody) return;
    tableBody.querySelectorAll('.btn-send-client').forEach(button => {
        // Remove listener antigo para evitar duplicação
        button.replaceWith(button.cloneNode(true));
    });
    // Adiciona novos listeners
    tableBody.querySelectorAll('.btn-send-client').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Impede outros eventos de clique na linha
            const rowId = button.dataset.rowId;
            const row = button.closest('tr');
            const clientName = row?.cells[2]?.textContent || 'Cliente'; // Pega nome da célula
            sendConfirmationToClientStatus(rowId, clientName, button);
        });
    });
}


/**
 * Renderiza a tabela editável dentro do sheet do Painel de Status.
 */
function renderStatusPanelInputTable() {
    const currentInputTable = document.getElementById("statusPanelInputTable");
    if (!currentInputTable) {
        console.error("Erro: Elemento #statusPanelInputTable não encontrado.");
        return;
    }

    const tableHead = currentInputTable.querySelector('thead');
    const tableBody = currentInputTable.querySelector('tbody');

    if (!tableHead || !tableBody) {
        console.error("Erro: thead ou tbody não encontrados em #statusPanelInputTable.");
        return;
    }

    // Limpa e recria cabeçalho
    tableHead.innerHTML = '';
    const headerRow = document.createElement('tr');
    STATUS_PANEL_CONFIG.displayTableHeaders.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        if (['#', 'Data', 'Status', 'AÇÕES'].includes(headerText)) {
            th.classList.add('text-center');
        }
        // Adiciona estilos de largura se necessário
        if (headerText === '#') th.style.width = '50px';
        if (headerText === 'Data') th.style.width = '120px';
        if (headerText === 'Status') th.style.width = '180px';
        if (headerText === 'AÇÕES') th.style.width = '80px';
        headerRow.appendChild(th);
    });
    tableHead.appendChild(headerRow);

    // Limpa e recria corpo da tabela
    tableBody.innerHTML = '';
    if (statusPanelInputTableData.length > 0) {
        statusPanelInputTableData.forEach((item, index) => {
            const tr = document.createElement('tr');
            tr.dataset.index = index; // Índice no array statusPanelInputTableData
            tr.dataset.rowId = item.id || ''; // ID do banco de dados, se existir
            if (item._delete) { tr.classList.add('row-to-delete'); }

            STATUS_PANEL_CONFIG.displayTableHeaders.forEach(header => {
                const td = document.createElement('td');
                if (header === 'AÇÕES') {
                    td.classList.add('text-center');
                    const button = document.createElement('button');
                    button.className = 'btn btn-danger btn-icon-only btn-sm';
                    button.title = 'Excluir Linha';
                    button.dataset.action = 'delete';
                    button.innerHTML = `<svg class="icon" viewBox="0 0 24 24" style="width:14px; height:14px;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
                    td.appendChild(button);
                } else {
                    // Usa os cabeçalhos do banco (expectedDbHeaders) para pegar o valor correto
                    const dbHeader = STATUS_PANEL_CONFIG.expectedDbHeaders.find(h => h === header);
                    const value = dbHeader ? (item[dbHeader] !== null && item[dbHeader] !== undefined ? item[dbHeader] : '') : '';

                    const input = document.createElement('input');
                    input.type = 'text';
                    input.className = 'input input-sm'; // Usa classe .input
                    input.value = value;
                    input.dataset.header = dbHeader || header; // Usa o header do DB no dataset
                    td.appendChild(input);
                    if (['#', 'Data', 'Status'].includes(header)) {
                        td.classList.add('text-center');
                    }
                }
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });
    } else {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = STATUS_PANEL_CONFIG.displayTableHeaders.length;
        td.classList.add('text-center');
        td.innerHTML = `<p style="color: var(--gray-text);">Nenhum dado para editar.</p>`;
        tr.appendChild(td);
        tableBody.appendChild(tr);
    }
}


/**
 * Gera o HTML para o badge de status na tabela principal.
 * @param {object} item - O objeto da linha de dados.
 * @returns {string} HTML do badge e botão (se aplicável).
 */
function getStatusPanelBadgeHtml(item) {
    const status = item.STATUS;
    if (!status) return '<span class="status-badge status-badge-default">Sem Status</span>';

    const s = status.toLowerCase();
    let className = 'status-badge';
    if (s === 'aguardando') className += ' status-badge-aguardando';
    else if (s === 'confirmado') className += ' status-badge-confirmado';
    else if (s === 'cancelado') className += ' status-badge-cancelado';
    else if (s === 'bom dia ☀️') className += ' status-badge-bom-dia';
    else if (s === 'em execução') className += ' status-badge-em-execucao';
    else if (s === 'enviar') className += ' status-badge-enviar';
    else className += ' status-badge-default';

    let buttonHtml = '';
    // Adiciona botão apenas se o status for 'Confirmado' e tiver ID
    if (s === 'confirmado' && item.id) {
        // O listener será adicionado dinamicamente por addSendConfirmationListeners
        buttonHtml = `<button class="btn btn-send-client btn-icon-only btn-sm" data-row-id="${item.id}" title="Enviar Confirmação Cliente">
            <svg class="icon" viewBox="0 0 24 24" fill="transparent" style="stroke: #00d5ff; width:16px; height:16px;"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>`;
    }

    return `<div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;"><span class="${className}">${status}</span>${buttonHtml}</div>`;
}

/**
 * Abre o sheet de dados do Painel de Status.
 */
async function openStatusPanelDataSheet() {
    const openDataSheetBtn = document.getElementById("statusPanelOpenDataSheetBtn");
    if (!openDataSheetBtn) return;
    const originalButtonHtml = openDataSheetBtn.innerHTML;
    openDataSheetBtn.innerHTML = `<svg class="icon icon-spin" viewBox="0 0 24 24" style="width:16px; height:16px;"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg> Carregando...`;
    openDataSheetBtn.disabled = true;

    const sheetBackdrop = document.getElementById("statusPanelSheetBackdrop");
    const dataSheet = document.getElementById("statusPanelDataSheet");
    if (!sheetBackdrop || !dataSheet) return;

    // Mostra backdrop e sheet
    sheetBackdrop.style.display = 'block';
    dataSheet.style.display = 'flex'; // Usa flex para sheets
    await new Promise(resolve => setTimeout(resolve, 10)); // Pequeno delay para transição
    sheetBackdrop.classList.add("show");
    dataSheet.classList.add("show");
    document.body.style.overflow = "hidden"; // Trava scroll do body

    // Reseta estado do botão Adicionar/Confirmar
    const addDataBtn = dataSheet.querySelector("#statusPanelAddDataBtn");
    if(addDataBtn) {
        addDataBtn.innerHTML = `<svg class="icon" viewBox="0 0 24 24" style="width:16px; height:16px;"> <line x1="12" y1="5" x2="12" y2="19"></line> <line x1="5" y1="12" x2="19" y2="12"></line> </svg> Adicionar Dados`;
        addDataBtn.disabled = false;
    }
    // Garante que a aba de tabela esteja visível e a de input escondida
    dataSheet.querySelector('#tableTab')?.classList.add('active');
    dataSheet.querySelector('#inputTab')?.classList.remove('active');
    dataSheet.querySelector('.tab-trigger[data-tab="table"]')?.classList.add('active');
    dataSheet.querySelector('.tab-trigger[data-tab="input"]')?.classList.remove('active');


    // Carrega dados para a tabela editável
    const success = await fetchDataForStatusPanelSheet();

    // Restaura botão principal
    openDataSheetBtn.innerHTML = originalButtonHtml;
    openDataSheetBtn.disabled = false;
    if (!success) closeStatusPanelDataSheet(); // Fecha se falhar ao carregar
}

/**
 * Fecha o sheet de dados do Painel de Status.
 */
function closeStatusPanelDataSheet() {
    closeStatusPanelModal('statusPanelDataSheet'); // Usa a função genérica
}

/**
 * Lida com o clique no botão "Adicionar Dados" / "Confirmar Dados" no sheet.
 */
async function handleStatusPanelAddData() {
    const inputTab = document.getElementById("inputTab");
    const tableTab = document.getElementById("tableTab");
    const dataInput = document.getElementById("statusPanelDataInput");
    const addDataBtn = document.getElementById("statusPanelAddDataBtn");

    if (!inputTab || !tableTab || !dataInput || !addDataBtn) return;

    // Se a aba de input estiver escondida, mostra ela e muda o botão para "Confirmar"
    if (!inputTab.classList.contains('active')) {
        // Troca para a aba de input
        inputTab.classList.add('active');
        tableTab.classList.remove('active');
        document.querySelector('.tab-trigger[data-tab="input"]')?.classList.add('active');
        document.querySelector('.tab-trigger[data-tab="table"]')?.classList.remove('active');

        addDataBtn.innerHTML = `<svg class="icon" viewBox="0 0 24 24" style="width:16px; height:16px;"><path d="M20 6L9 17l-5-5"></path></svg> Confirmar Dados`;
        dataInput.focus();
    } else {
        // Se a aba de input já estiver visível, processa os dados
        const text = dataInput.value.trim();
        if (text) {
            addDataBtn.disabled = true;
            addDataBtn.innerHTML = `<svg class="icon icon-spin" viewBox="0 0 24 24" style="width:16px; height:16px;"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg> Processando...`;

            await processAndAddStatusPanelData(); // Chama a função que processa e salva

            // Volta para a aba da tabela se dados foram adicionados
            if (statusPanelInputTableData.length > 0) {
                inputTab.classList.remove('active');
                tableTab.classList.add('active');
                document.querySelector('.tab-trigger[data-tab="input"]')?.classList.remove('active');
                document.querySelector('.tab-trigger[data-tab="table"]')?.classList.add('active');
                addDataBtn.innerHTML = `<svg class="icon" viewBox="0 0 24 24" style="width:16px; height:16px;"> <line x1="12" y1="5" x2="12" y2="19"></line> <line x1="5" y1="12" x2="19" y2="12"></line> </svg> Adicionar Dados`;
                dataInput.value = ""; // Limpa o textarea
            } else {
                // Mantém na aba de input se não houve dados válidos
                showToast("Aviso", "Nenhum dado válido para adicionar.", "warning");
            }
            addDataBtn.disabled = false;
        } else {
            showToast("Aviso", "Por favor, cole algum dado no campo de texto.", "warning");
        }
    }
}

/**
 * Processa os dados colados no textarea e os adiciona à tabela editável e ao Supabase.
 */
async function processAndAddStatusPanelData() {
    const dataInput = document.getElementById("statusPanelDataInput");
    if (!dataInput) return;
    const text = dataInput.value.trim();
    if (!text) {
        showToast("Aviso", "Nenhum dado para processar.", "warning");
        return;
    }

    const lines = text.split('\n');
    const newData = [];
    const expectedHeaders = STATUS_PANEL_CONFIG.expectedDbHeaders.filter(h => h !== 'id' && h !== 'whatscliente' && h !== 'STATUS'); // Cabeçalhos esperados da colagem

    lines.forEach((line, lineIndex) => {
        if (line.trim() === '') return;
        const cols = line.split('\t'); // Assume separador TAB

        // Verifica se tem o número mínimo de colunas esperado
        if (cols.length < expectedHeaders.length) {
            console.warn(`Linha ${lineIndex + 1} ignorada: número de colunas (${cols.length}) menor que o esperado (${expectedHeaders.length}).`);
            return;
        }

        const rowData = {};
        // Mapeia colunas coladas para os cabeçalhos do DB
        expectedHeaders.forEach((header, i) => {
            rowData[header] = cols[i]?.trim() || ''; // Pega valor da coluna correspondente
        });

        // Define status padrão e extrai WhatsApp
        rowData['STATUS'] = 'ENVIAR';
        let whatsNumber = '';
        const clientName = rowData['CLIENTE'] || '';
        const digitsMatch = clientName.match(/\d+/g);
        if (digitsMatch) {
            const allDigits = digitsMatch.join('');
            if (allDigits.length === 10 || allDigits.length === 11) {
                whatsNumber = `55${allDigits}`; // Adiciona DDI 55
            }
        }
        rowData['whatscliente'] = whatsNumber;
        rowData['id'] = null; // Garante que é um novo registro

        newData.push(rowData);
    });

    if (newData.length === 0) {
        showToast("Aviso", "Nenhum dado válido encontrado no texto colado. Verifique o formato e o separador (TAB).", "warning");
        return;
    }

    // Adiciona os novos dados ao início da tabela editável
    statusPanelInputTableData = [...newData, ...statusPanelInputTableData];
    renderStatusPanelInputTable(); // Atualiza a visualização da tabela editável

    // Salva os novos dados no Supabase
    await saveNewStatusPanelData(newData);
}

/**
 * Salva novas linhas de dados do Painel de Status no Supabase.
 * @param {Array<object>} rowsToInsert - Array de objetos representando as novas linhas.
 */
async function saveNewStatusPanelData(rowsToInsert) {
    if (!rowsToInsert || rowsToInsert.length === 0) return;

    const scrollArea = document.querySelector('#tableTab .scroll-area');
    const scrollTop = scrollArea ? scrollArea.scrollTop : 0; // Salva posição do scroll

    console.log(`Salvando ${rowsToInsert.length} novas linhas no Supabase...`);

    try {
        // Prepara o payload garantindo todos os cabeçalhos esperados
        const payload = rowsToInsert.map(row => {
            const cleanRow = {};
            STATUS_PANEL_CONFIG.expectedDbHeaders.forEach(header => {
                // Não inclui 'id' na inserção
                if (header !== 'id') {
                    cleanRow[header] = row[header] !== undefined ? row[header] : null;
                }
            });
            return cleanRow;
        });

        const { data: insertedData, error } = await supabase
            .from(statusPanelEmpresaAtual.tableName)
            .insert(payload)
            .select(); // Pede retorno dos dados inseridos com IDs

        if (error) throw error;
        if (!insertedData || insertedData.length === 0) throw new Error("Nenhum dado retornado após inserção.");

        console.log(`${insertedData.length} linhas inseridas com sucesso.`);

        // Atualiza os dados na tabela local (statusPanelInputTableData) com os IDs retornados
        insertedData.forEach(insertedRow => {
            // Encontra a linha correspondente que ainda não tem ID
            const matchingRowIndex = statusPanelInputTableData.findIndex(localRow =>
                !localRow.id &&
                localRow['DATA'] === insertedRow['DATA'] &&
                localRow['CLIENTE'] === insertedRow['CLIENTE'] &&
                localRow['PROFISSIONAL'] === insertedRow['PROFISSIONAL'] // Adiciona mais critérios se necessário
            );
            if (matchingRowIndex !== -1) {
                // Atualiza a linha local com os dados completos do banco (incluindo ID)
                statusPanelInputTableData[matchingRowIndex] = { ...statusPanelInputTableData[matchingRowIndex], ...insertedRow };
            } else {
                console.warn("Não foi possível encontrar a linha local correspondente para:", insertedRow);
            }
        });

        showToast("Sucesso", `${insertedData.length} nova(s) linha(s) salva(s) no banco!`);
        renderStatusPanelInputTable(); // Re-renderiza a tabela editável com os IDs
        await fetchStatusPanelData(); // Atualiza a tabela principal
        if (scrollArea) scrollArea.scrollTop = scrollTop; // Restaura posição do scroll

    } catch (error) {
        console.error("Erro saveNewStatusPanelData:", error);
        showToast("Erro", `Falha ao salvar novas linhas: ${error.message}`, "error");
    }
}


/**
 * Atualiza o array `statusPanelInputTableData` quando um input na tabela editável é modificado.
 * @param {number} index - Índice da linha no array.
 * @param {string} header - O nome do cabeçalho (coluna) modificado.
 * @param {string} value - O novo valor do input.
 */
function updateStatusPanelInputTableData(index, header, value) {
    if (statusPanelInputTableData[index] && header !== undefined) {
        statusPanelInputTableData[index][header] = value;
        // Marca a linha como modificada se ela já tiver um ID (veio do banco)
        if (statusPanelInputTableData[index].id) {
            statusPanelInputTableData[index]._modified = true;
            console.log(`Linha ${index} (ID: ${statusPanelInputTableData[index].id}) marcada como modificada.`);
        }
    }
}

/**
 * Adiciona uma nova linha vazia no topo da tabela editável do sheet.
 */
function addNewStatusPanelRow() {
    const newRowData = {};
    STATUS_PANEL_CONFIG.expectedDbHeaders.forEach(header => { newRowData[header] = ''; });
    newRowData['STATUS'] = 'ENVIAR'; // Status padrão para novas linhas
    newRowData['id'] = null; // Garante que não tem ID
    statusPanelInputTableData.unshift(newRowData); // Adiciona no início do array
    renderStatusPanelInputTable(); // Re-renderiza a tabela

    // Foca no primeiro input da nova linha
    const firstInput = document.querySelector('#statusPanelInputTableBody tr:first-child input');
    firstInput?.focus();

    showToast("Info", "Nova linha adicionada no topo. Preencha os dados e clique em 'Salvar Alterações'.");
}

/**
 * Marca uma linha na tabela editável para exclusão ou a remove se ainda não foi salva.
 * @param {number} index - Índice da linha no array `statusPanelInputTableData`.
 */
function removeStatusPanelInputRow(index) {
    const rowData = statusPanelInputTableData[index];
    if (!rowData) return;

    const rowIdentifier = rowData.id ? `ID ${rowData.id}` : `linha ${index + 1} (nova)`;
    const clientName = rowData.CLIENTE ? `(${formatClientNameStatus(rowData.CLIENTE)})` : '';

    if (confirm(`Tem certeza que deseja remover a ${rowIdentifier} ${clientName}?`)) {
        if (rowData.id) {
            // Se a linha tem ID (veio do banco), marca para exclusão
            rowData._delete = true;
            showToast("Aviso", `Linha ${rowIdentifier} marcada para exclusão. Clique em 'Salvar Alterações' para confirmar.`, "warning");
        } else {
            // Se a linha não tem ID (foi adicionada manualmente e não salva), remove diretamente
            statusPanelInputTableData.splice(index, 1);
            showToast("Sucesso", `Linha ${rowIdentifier} removida.`);
        }
        renderStatusPanelInputTable(); // Re-renderiza a tabela para refletir a mudança
    }
}

/**
 * Salva as alterações (updates e deletes) feitas na tabela editável do sheet no Supabase.
 */
async function handleStatusPanelUpdate() {
    const rowsToUpdate = statusPanelInputTableData.filter(item => item.id && item._modified && !item._delete);
    const rowsToDelete = statusPanelInputTableData.filter(item => item.id && item._delete);

    if (rowsToUpdate.length === 0 && rowsToDelete.length === 0) {
        showToast("Aviso", "Nenhuma alteração ou exclusão para salvar.", "warning");
        return;
    }

    const scrollArea = document.querySelector('#tableTab .scroll-area');
    const scrollTop = scrollArea ? scrollArea.scrollTop : 0; // Salva posição do scroll
    const updateDataBtn = document.getElementById("statusPanelUpdateDataBtn");
    if (!updateDataBtn) return;
    updateDataBtn.disabled = true;
    updateDataBtn.innerHTML = `<svg class="icon icon-spin" viewBox="0 0 24 24" style="width:16px; height:16px;"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg> Salvando...`;

    let updatedCount = 0, deletedCount = 0;
    let updateErrors = [], deleteErrors = [];

    try {
        // Processa Updates
        if (rowsToUpdate.length > 0) {
            console.log(`Atualizando ${rowsToUpdate.length} linhas...`);
            for (const row of rowsToUpdate) {
                const updatePayload = {};
                STATUS_PANEL_CONFIG.expectedDbHeaders.forEach(header => {
                    // Não inclui 'id' no payload de update, mas inclui outros campos como 'whatscliente'
                    if (header !== 'id') {
                        updatePayload[header] = row[header] !== undefined ? row[header] : null;
                    }
                });

                try {
                    const { error } = await supabase
                        .from(statusPanelEmpresaAtual.tableName)
                        .update(updatePayload)
                        .eq('id', row.id);
                    if (error) throw error;
                    updatedCount++;
                    row._modified = false; // Reseta flag após sucesso
                } catch (error) {
                    console.error(`Erro ao atualizar linha ID ${row.id}:`, error);
                    updateErrors.push(`ID ${row.id}: ${error.message}`);
                }
            }
        }

        // Processa Deletes
        if (rowsToDelete.length > 0) {
            const idsToDelete = rowsToDelete.map(row => row.id);
            console.log(`Deletando ${idsToDelete.length} linhas:`, idsToDelete);
            try {
                const { error } = await supabase
                    .from(statusPanelEmpresaAtual.tableName)
                    .delete()
                    .in('id', idsToDelete);
                if (error) throw error;
                deletedCount = idsToDelete.length;
                // Remove as linhas deletadas do array local
                statusPanelInputTableData = statusPanelInputTableData.filter(item => !item._delete);
            } catch (error) {
                console.error("Erro ao deletar linhas:", error);
                deleteErrors.push(error.message);
                // Mantém as flags _delete nas linhas que falharam ao deletar
                rowsToDelete.forEach(row => {
                    if (!deleteErrors.some(errMsg => errMsg.includes(`ID ${row.id}`))) { // Exemplo de verificação
                        row._delete = false; // Reseta flag se não houve erro específico para ela
                    }
                });
            }
        }

        // Feedback final
        let toastMessage = ""; let toastType = "success";
        if (updatedCount > 0) toastMessage += `${updatedCount} linha(s) atualizada(s). `;
        if (deletedCount > 0) toastMessage += `${deletedCount} linha(s) removida(s). `;
        if (updateErrors.length > 0 || deleteErrors.length > 0) {
            toastMessage += ` Falhas: ${updateErrors.length} atualização(ões), ${deleteErrors.length} remoção(ões). Ver console.`;
            toastType = "warning";
        }
        if (toastMessage) { showToast(toastType === "success" ? "Sucesso" : "Atenção", toastMessage, toastType); }
        else { showToast("Aviso", "Nenhuma alteração foi efetivamente salva.", "warning"); }

        renderStatusPanelInputTable(); // Re-renderiza a tabela editável
        if (scrollArea) scrollArea.scrollTop = scrollTop; // Restaura scroll
        await fetchStatusPanelData(); // Atualiza a tabela principal

    } catch (error) {
        console.error("Erro geral no handleStatusPanelUpdate:", error);
        showToast("Erro", `Falha geral ao aplicar alterações: ${error.message}`, "error");
    } finally {
        updateDataBtn.disabled = false;
        updateDataBtn.innerHTML = `<svg class="icon" viewBox="0 0 24 24" style="width:16px; height:16px;"> <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path> <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path> </svg> Salvar Alterações`;
    }
}


/**
 * Lida com o clique no botão "Enviar" do Painel de Status (dispara webhook).
 */
async function handleStatusPanelSend() {
    // TODO: Implementar chamada segura ao webhook via backend ou Função Edge
    if (statusPanelIsSending) return;
    statusPanelIsSending = true;
    updateStatusPanelSendButton();
    try {
        // const webhookUrl = statusPanelEmpresaAtual.webhookUrl; // Mover para backend
        // if (!webhookUrl) throw new Error("Webhook URL não configurada para esta empresa.");
        // const response = await fetch(webhookUrl, {
        //     method: "POST", headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ action: "enviar" }) // Payload exemplo
        // });
        // if (!response.ok) throw new Error(`Erro (${response.status}): ${await response.text()}`);
        console.log("// TODO: Implementar chamada segura ao webhook 'enviar' via backend/Edge Function.");
        showToast("Sucesso", "Simulando: Comando de envio iniciado!");
        await new Promise(res => setTimeout(res, 1000)); // Simula delay
    } catch (error) {
        console.error("Erro handleStatusPanelSend:", error);
        showToast("Erro", `Falha ao iniciar envio: ${error.message}`, "error");
    } finally {
        statusPanelIsSending = false;
        updateStatusPanelSendButton();
    }
}

/**
 * Atualiza o estado visual do botão "Enviar" do Painel de Status.
 */
function updateStatusPanelSendButton() {
    const sendAttendanceBtn = document.getElementById("statusPanelSendAttendanceBtn");
    if (!sendAttendanceBtn) return;
    if (statusPanelIsSending) {
        sendAttendanceBtn.innerHTML = `<svg class="icon icon-spin" viewBox="0 0 24 24" style="width:16px; height:16px;"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg> Enviando...`;
        sendAttendanceBtn.disabled = true;
    } else {
        sendAttendanceBtn.innerHTML = `<svg class="icon" viewBox="0 0 24 24" style="width:16px; height:16px;"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg> Enviar`;
        sendAttendanceBtn.disabled = false;
    }
}

/**
 * Envia a confirmação para um cliente específico (dispara webhook).
 * @param {string} rowId - ID da linha no banco de dados.
 * @param {string} clientName - Nome formatado do cliente.
 * @param {HTMLElement} button - O botão que foi clicado.
 */
async function sendConfirmationToClientStatus(rowId, clientName, button) {
    if (!rowId) { showToast("Erro", "ID da linha não encontrado para envio.", "error"); return; }
    if (!button) return;

    button.disabled = true;
    button.innerHTML = `<svg class="icon icon-spin" viewBox="0 0 24 24" style="width:16px; height:16px;"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>`;

    try {
        // const webhookUrl = statusPanelEmpresaAtual.webhookUrl; // Mover para backend
        // if (!webhookUrl) throw new Error("Webhook URL não configurada para esta empresa.");
        // const response = await fetch(webhookUrl, {
        //     method: "POST", headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ action: "confirmar", rowId: rowId, clientName: clientName }) // Payload exemplo
        // });
        // if (!response.ok) throw new Error(`Erro (${response.status}): ${await response.text()}`);
        console.log(`// TODO: Implementar chamada segura ao webhook 'confirmar' (rowId: ${rowId}) via backend/Edge Function.`);
        showToast("Sucesso", `Simulando: Confirmação para ${clientName} enviada!`);
        await new Promise(res => setTimeout(res, 1000)); // Simula delay
        // Remove o botão e o badge container após sucesso (ou apenas o botão)
        button.closest('div')?.remove(); // Remove o container flex do badge e botão
    } catch (error) {
        console.error("Erro sendConfirmationToClientStatus:", error);
        showToast("Erro", `Falha ao enviar confirmação: ${error.message}`, "error");
        // Restaura o botão em caso de erro
        button.disabled = false;
        button.innerHTML = `<svg class="icon" viewBox="0 0 24 24" fill="transparent" style="stroke: #00d5ff; width:16px; height:16px;"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`;
    }
}

/**
 * Abre o modal de confirmação para limpar a tabela do Painel de Status.
 */
function handleStatusPanelClear() {
    const confirmModal = document.getElementById("statusPanelConfirmClearModal");
    const tableNameSpan = document.getElementById("confirmClearTableName");
    if (tableNameSpan) {
        tableNameSpan.textContent = statusPanelEmpresaAtual.tableName || 'a tabela selecionada';
    }
    openStatusPanelModal('statusPanelConfirmClearModal');
}

/**
 * Prossegue com a limpeza da tabela do Painel de Status após confirmação.
 * IMPORTANTE: Esta operação requer privilégios elevados e deve ser movida para o backend/Função Edge.
 */
async function proceedWithStatusPanelClear() {
    // --- ALERTA DE SEGURANÇA ---
    // A operação DELETE sem filtros específicos é perigosa e requer privilégios elevados.
    // Esta implementação no frontend é INSEGURA devido à chave de serviço exposta anteriormente.
    // A lógica real DEVE ser movida para um ambiente seguro (backend/Função Edge).
    console.warn("OPERAÇÃO INSEGURA: Tentativa de limpar tabela do frontend.");
    showToast("Erro", "Operação de limpeza não permitida diretamente do frontend por segurança.", "error");
    closeStatusPanelModal('statusPanelConfirmClearModal');
    return; // Impede a execução da lógica insegura

    /* --- LÓGICA INSEGURA (NÃO USAR EM PRODUÇÃO) ---
    if (statusPanelIsClearing) return;
    statusPanelIsClearing = true;
    const clearDataBtn = document.getElementById("statusPanelClearDataBtn");
    const confirmClearBtn = document.getElementById("statusPanelConfirmClearBtn");
    // ... (lógica para desabilitar botões e mostrar loading) ...

    try {
        const tableName = statusPanelEmpresaAtual.tableName;
        if (!tableName) throw new Error("Nome da tabela não definido.");

        // *** ESTA LINHA É INSEGURA NO FRONTEND ***
        // const { error } = await supabase.from(tableName).delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Exemplo de filtro mínimo

        // if (error) throw error;

        statusPanelInputTableData = [];
        statusPanelTableData = [];
        renderStatusPanelInputTable();
        renderStatusPanelTable();
        showToast("Sucesso", `Todos os dados da tabela ${tableName} foram limpos.`);
        closeStatusPanelDataSheet();
        closeStatusPanelModal('statusPanelConfirmClearModal');

    } catch (error) {
        console.error("Erro proceedWithStatusPanelClear:", error);
        showToast("Erro", `Falha ao limpar tabela: ${error.message}`, "error");
    } finally {
        statusPanelIsClearing = false;
        // ... (lógica para reabilitar botões) ...
    }
    */
}


/**
 * Abre o modal para adicionar um novo profissional.
 */
function openStatusPanelAddProfessionalModal() {
    const modal = document.getElementById("statusPanelAddProfessionalModal");
    const nameInput = document.getElementById("statusPanelProfessionalName");
    const whatsappInput = document.getElementById("statusPanelProfessionalWhatsapp");
    if (modal && nameInput && whatsappInput) {
        nameInput.value = "";
        whatsappInput.value = "";
        openStatusPanelModal('statusPanelAddProfessionalModal');
        nameInput.focus();
    }
}

/**
 * Salva um novo profissional no Supabase.
 */
async function saveStatusPanelProfessional() {
    const nameInput = document.getElementById("statusPanelProfessionalName");
    const whatsappInput = document.getElementById("statusPanelProfessionalWhatsapp");
    const saveBtn = document.getElementById("statusPanelSaveProfessionalBtn");
    if (!nameInput || !whatsappInput || !saveBtn) return;

    const name = nameInput.value.trim();
    const whatsapp = whatsappInput.value.trim();
    if (!name || !whatsapp) {
        showToast("Aviso", "Por favor, preencha nome e WhatsApp.", "warning");
        return;
    }
    const whatsappClean = whatsapp.replace(/\D/g, "");
    // Validação simples do número (ajustar conforme necessário)
    if (!whatsappClean.startsWith('55') || (whatsappClean.length !== 12 && whatsappClean.length !== 13)) {
        showToast("Aviso", "Formato do WhatsApp inválido. Use DDI 55 + DDD + Número (ex: 55119...)", "warning");
        whatsappInput.focus();
        return;
    }

    const payload = { NOME: name, WHATSAPP: whatsappClean }; // Nomes das colunas como no original
    const tableName = statusPanelEmpresaAtual.addprofissionalTable;
    if (!tableName) {
        showToast("Erro", "Tabela de profissionais não configurada para esta empresa.", "error");
        return;
    }

    saveBtn.disabled = true;
    saveBtn.innerHTML = `<svg class="icon icon-spin" viewBox="0 0 24 24" style="width:16px; height:16px;"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg> Salvando...`;

    try {
        console.log(`Salvando profissional na tabela: ${tableName}`, payload);
        const { error } = await supabase.from(tableName).insert([payload]);
        if (error) throw error;
        showToast("Sucesso", `Profissional ${name} cadastrado com sucesso!`);
        closeStatusPanelModal('statusPanelAddProfessionalModal');
    } catch (error) {
        console.error("Erro saveStatusPanelProfessional:", error);
        // Verifica erro de duplicação (exemplo, pode variar com a config do DB)
        if (error.message.includes('duplicate key value violates unique constraint')) {
             showToast("Erro", `Profissional com este nome ou WhatsApp já existe.`, "error");
        } else {
             showToast("Erro", `Falha ao salvar profissional: ${error.message}`, "error");
        }
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = `<svg class="icon" viewBox="0 0 24 24" style="width:16px; height:16px;"> <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path> <polyline points="17 21 17 13 7 13 7 21"></polyline> <polyline points="7 3 7 8 15 8"></polyline> </svg> Salvar`;
    }
}

/**
 * Abre um modal/sheet específico do Painel de Status.
 * @param {string} modalId - O ID do modal/sheet a ser aberto.
 */
function openStatusPanelModal(modalId) {
    const backdropId = `${modalId}Backdrop`; // Assume que o backdrop tem ID correspondente
    const modal = document.getElementById(modalId);
    const backdrop = document.getElementById(backdropId);

    if (modal && backdrop) {
        backdrop.style.display = 'block';
        modal.style.display = modal.classList.contains('sheet') ? 'flex' : 'block'; // 'flex' para sheets
        setTimeout(() => {
            backdrop.classList.add("show");
            modal.classList.add("show");
        }, 10);
        document.body.style.overflow = "hidden";
    } else {
        console.error(`Modal ou backdrop não encontrado para ID: ${modalId}`);
    }
}

/**
 * Fecha um modal/sheet específico do Painel de Status.
 * @param {string} modalId - O ID do modal/sheet a ser fechado.
 */
function closeStatusPanelModal(modalId) {
    const backdropId = `${modalId}Backdrop`;
    const modal = document.getElementById(modalId);
    const backdrop = document.getElementById(backdropId);

    if (modal && backdrop) {
        modal.classList.remove("show");
        backdrop.classList.remove("show");
        setTimeout(() => {
            if (!backdrop.classList.contains("show")) { // Verifica se não foi reaberto
                backdrop.style.display = "none";
                modal.style.display = "none";
            }
        }, 300); // Tempo da transição CSS
    }
    document.body.style.overflow = ""; // Restaura scroll
}

/**
 * Inicializa as abas dentro do sheet de dados do Painel de Status.
 */
function initStatusPanelSheetTabs() {
    const dataSheet = document.getElementById('statusPanelDataSheet');
    if (!dataSheet) return;
    const tabsList = dataSheet.querySelector('.tabs-list');
    if (!tabsList) return;

    tabsList.addEventListener('click', (event) => {
        const trigger = event.target.closest('.tab-trigger');
        if (trigger && trigger.dataset.tab) {
            const tabId = trigger.dataset.tab;
            const currentlyActiveTrigger = tabsList.querySelector('.tab-trigger.active');
            const currentlyActiveContent = dataSheet.querySelector('.tab-content.active');

            if (currentlyActiveTrigger) currentlyActiveTrigger.classList.remove('active');
            if (currentlyActiveContent) currentlyActiveContent.classList.remove('active');

            trigger.classList.add('active');
            const newActiveContent = dataSheet.querySelector(`#${tabId}Tab`);
            if (newActiveContent) newActiveContent.classList.add('active');

            // Ajusta o texto do botão "Adicionar/Confirmar" ao trocar de aba
            const addDataBtn = document.getElementById("statusPanelAddDataBtn");
            if (addDataBtn) {
                 if (tabId === 'input') {
                     addDataBtn.innerHTML = `<svg class="icon" viewBox="0 0 24 24" style="width:16px; height:16px;"><path d="M20 6L9 17l-5-5"></path></svg> Confirmar Dados`;
                 } else {
                     addDataBtn.innerHTML = `<svg class="icon" viewBox="0 0 24 24" style="width:16px; height:16px;"> <line x1="12" y1="5" x2="12" y2="19"></line> <line x1="5" y1="12" x2="19" y2="12"></line> </svg> Adicionar Dados`;
                 }
            }
        }
    });
}


console.log("Status Panel JS carregado.");
