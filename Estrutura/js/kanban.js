// Variáveis específicas do Kanban
let kanbanSortableInstances = [];
let currentKanbanCandidateData = null; // Guarda dados da candidata no modal Kanban
let isNewKanbanCardMode = false; // Flag para indicar se o modal Kanban está em modo de adição
let initialKanbanCardStatus = null; // Guarda o status inicial ao adicionar novo card Kanban

/**
 * Retorna o HTML base para a view Kanban.
 */
function getKanbanViewHTML() {
    return `
        <div class="kanban-view view-container active"> <!-- Adiciona active aqui -->
            <!-- Cabeçalho Kanban -->
            <div class="header">
                <div class="header-main"><h1 class="header-title">Recrutamento</h1></div>
                <div class="header-actions">
                   <div class="search-wrapper">
                       <svg class="icon search-icon" viewBox="0 0 24 24">
                           <circle cx="11" cy="11" r="8"></circle>
                           <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                       </svg>
                       <input type="search" class="search-input" id="kanbanSearchInput" placeholder="Buscar card...">
                   </div>
                   <button class="theme-toggle-btn" title="Alternar Tema">
                       <!-- Ícone será definido pelo JS principal -->
                       <i class="fas fa-moon"></i>
                   </button>
                   <!-- Botões específicos do Kanban podem ser adicionados aqui se necessário -->
                   <!-- Ex: <button class="btn btn-primary btn-sm" onclick="openKanbanCandidateModal(null)"><i class="fas fa-plus"></i> Novo Card</button> -->
                </div>
            </div>
             <!-- Barra de Stats -->
            <div class="kanban-stats-bar">
                <div class="stat-item">
                    <div class="stat-item-value" id="stat-candidatas-mes">--</div>
                    <div class="stat-item-label">Candidatas Mês</div>
                </div>
                <div class="stat-item approved">
                    <div class="stat-item-value" id="stat-aprovadas">--</div>
                    <div class="stat-item-label">Aprovadas Mês</div>
                </div>
                <div class="stat-item rejected">
                    <div class="stat-item-value" id="stat-nao-aprovadas">--</div>
                    <div class="stat-item-label">Não Aprovadas Mês</div>
                </div>
                <div class="stat-item">
                    <div class="stat-item-value" id="stat-desistentes">--</div>
                    <div class="stat-item-label">Desistentes Mês</div>
                </div>
            </div>
            <!-- Board Kanban -->
            <div class="kanban-container">
                <div class="kanban-board" id="kanbanBoard">
                     <!-- Colunas serão carregadas pelo JS -->
                     <div class="content-placeholder">Carregando quadro Kanban...</div>
                </div>
            </div>
        </div>

        <!-- Modals específicos do Kanban -->
        ${getKanbanModalsHTML()}
    `;
}

/**
 * Retorna o HTML para os modais usados na view Kanban.
 */
function getKanbanModalsHTML() {
    // Reutiliza a estrutura de modal definida no CSS, adaptando IDs e conteúdo
    return `
        <!-- Modal Detalhes/Adicionar Candidata Kanban -->
        <div class="modal-backdrop" id="kanbanCandidateModal">
          <div class="modal"> <!-- Classe edit-mode será adicionada/removida via JS -->
            <div class="modal-header">
              <div class="candidate-avatar" id="kanban-modal-avatar">??</div>
              <div>
                  <h2 class="modal-title">
                      <span class="display-field" id="kanban-modal-candidate-name">Carregando...</span>
                      <input type="text" id="kanban-modal-candidate-name-input" class="form-input edit-field" placeholder="Nome Completo">
                  </h2>
                  <p class="modal-subtitle" id="kanban-modal-candidate-subtitle">Carregando...</p>
              </div>
              <button class="modal-close" onclick="closeKanbanModal('kanbanCandidateModal')"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <div class="tabs">
                    <div class="tab active" data-tab="profile">Perfil</div>
                    <div class="tab" data-tab="details">Dados Completos</div>
                    <div class="tab" data-tab="notes">Notas</div>
                    <div class="tab" data-tab="activity">Atividades</div>
                </div>

                <!-- Aba Perfil -->
                <div class="tab-content active" id="profile-tab">
                    <div class="section-title">Contato e Disponibilidade</div>
                    <div class="details-grid">
                        <div class="detail-pair">
                            <label>Whatsapp</label>
                            <div class="whatsapp-container">
                                <span class="display-field" id="kanban-modal-whatsapp">-</span>
                                <input type="tel" id="kanban-modal-whatsapp-input" class="form-input edit-field" placeholder="(XX) XXXXX-XXXX">
                                <a href="#" id="kanban-modal-whatsapp-link" target="_blank" class="btn btn-sm btn-whatsapp display-field" style="display: none;"><i class="fab fa-whatsapp"></i> Chamar</a>
                            </div>
                        </div>
                         <div class="detail-pair">
                             <label>Dias Livres</label>
                             <span class="display-field" id="kanban-modal-dias-livres">-</span>
                             <input type="text" id="kanban-modal-dias-livres-input" class="form-input edit-field" placeholder="Ex: Seg, Qua">
                          </div>
                         <div class="detail-pair">
                             <label>Dias Semana</label>
                             <span class="display-field" id="kanban-modal-dias-semana">-</span>
                             <input type="text" id="kanban-modal-dias-semana-input" class="form-input edit-field" placeholder="Ex: Seg-Sex">
                          </div>
                    </div>
                     <div class="section-title">Experiência</div>
                     <div class="details-grid">
                         <div class="detail-pair">
                             <label>Residencial</label>
                             <span class="display-field" id="kanban-modal-exp-residencial">-</span>
                             <input type="text" id="kanban-modal-exp-residencial-input" class="form-input edit-field" placeholder="Ex: 5 anos">
                          </div>
                         <div class="detail-pair">
                             <label>Comercial</label>
                             <span class="display-field" id="kanban-modal-exp-comercial">-</span>
                             <input type="text" id="kanban-modal-exp-comercial-input" class="form-input edit-field" placeholder="Ex: 2 anos">
                          </div>
                     </div>
                </div>

                <!-- Aba Dados Completos -->
                <div class="tab-content" id="details-tab">
                    <div class="section-title">Dados Pessoais</div>
                    <div class="details-grid">
                        <div class="detail-pair">
                            <label>Nome Completo</label>
                            <span class="display-field" id="kanban-modal-detail-nome">-</span>
                            <input type="text" id="kanban-modal-detail-nome-input" class="form-input edit-field" placeholder="Nome Completo">
                        </div>
                        <div class="detail-pair">
                            <label>Data Nascimento</label>
                            <span class="display-field" id="kanban-modal-data-nasc">-</span> <span class="display-field" id="kanban-modal-idade" style="font-size: 0.8em; color: var(--text-secondary);"></span>
                            <input type="text" id="kanban-modal-data-nasc-input" class="form-input edit-field" placeholder="DD/MM/AAAA">
                        </div>
                        <div class="detail-pair">
                            <label>Endereço</label>
                            <span class="display-field" id="kanban-modal-endereco">-</span>
                            <input type="text" id="kanban-modal-endereco-input" class="form-input edit-field" placeholder="Rua, Número, Bairro...">
                        </div>
                        <div class="detail-pair">
                            <label>RG</label>
                            <span class="display-field" id="kanban-modal-rg">-</span>
                            <input type="text" id="kanban-modal-rg-input" class="form-input edit-field" placeholder="00.000.000-0">
                        </div>
                        <div class="detail-pair">
                            <label>CPF</label>
                            <span class="display-field" id="kanban-modal-cpf">-</span>
                            <input type="text" id="kanban-modal-cpf-input" class="form-input edit-field" placeholder="000.000.000-00">
                        </div>
                        <div class="detail-pair">
                            <label>Estado Civil</label>
                            <span class="display-field" id="kanban-modal-est-civil">-</span>
                            <input type="text" id="kanban-modal-est-civil-input" class="form-input edit-field" placeholder="Solteira, Casada...">
                        </div>
                        <div class="detail-pair">
                            <label>Possui Filhos?</label>
                            <span class="display-field" id="kanban-modal-filhos">-</span>
                            <input type="text" id="kanban-modal-filhos-input" class="form-input edit-field" placeholder="Sim/Não, Quantos?">
                        </div>
                        <div class="detail-pair">
                            <label>Rotina Filhos</label>
                            <span class="display-field" id="kanban-modal-rotina-filhos">-</span>
                            <input type="text" id="kanban-modal-rotina-filhos-input" class="form-input edit-field" placeholder="Detalhes da rotina">
                        </div>
                        <div class="detail-pair">
                            <label>Fumante?</label>
                            <span class="display-field" id="kanban-modal-fumante">-</span>
                            <input type="text" id="kanban-modal-fumante-input" class="form-input edit-field" placeholder="Sim/Não">
                        </div>
                        <div class="detail-pair">
                            <label>Restrição Pet?</label>
                            <span class="display-field" id="kanban-modal-pet">-</span>
                            <input type="text" id="kanban-modal-pet-input" class="form-input edit-field" placeholder="Sim/Não, Qual?">
                        </div>
                        <div class="detail-pair">
                            <label>Transporte</label>
                            <span class="display-field" id="kanban-modal-transporte">-</span>
                            <input type="text" id="kanban-modal-transporte-input" class="form-input edit-field" placeholder="Ônibus, Carro...">
                        </div>
                         <div class="detail-pair">
                             <label>Situação Atual</label>
                             <span class="display-field" id="kanban-modal-sit-atual">-</span>
                             <input type="text" id="kanban-modal-sit-atual-input" class="form-input edit-field" placeholder="Trabalhando, Disponível...">
                         </div>
                         <div class="detail-pair">
                             <label>Origem Cadastro</label>
                             <span class="display-field" id="kanban-modal-motivo-cadastro">-</span>
                             <input type="text" id="kanban-modal-motivo-cadastro-input" class="form-input edit-field" placeholder="Site, Indicação...">
                         </div>
                    </div>
                </div>

                <!-- Aba Notas -->
                <div class="tab-content" id="notes-tab">
                    <div class="section-title">Observações</div>
                    <div class="notes-container">
                        <span class="display-field" id="kanban-modal-notes-display" style="white-space: pre-wrap;">-</span>
                        <textarea id="kanban-modal-notes-textarea" class="form-textarea edit-field" placeholder="Adicione suas observações aqui..."></textarea>
                    </div>
                </div>

                <!-- Aba Atividades -->
                <div class="tab-content" id="activity-tab">
                    <div class="section-title">Histórico de Atividades</div>
                    <ul class="activity-log" id="kanban-modal-activity-log">
                        <li class="activity-item placeholder">
                            <div class="activity-title">Nenhuma atividade registrada</div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="modal-footer">
              <div class="left-actions">
                   <button class="btn btn-sm btn-outline" id="kanban-rejectCandidateBtn" style="color: var(--danger-color); border-color: var(--danger-color);"><i class="fas fa-times-circle"></i> Rejeitar</button>
                   <button class="btn btn-sm btn-outline" id="kanban-send-term-btn" onclick="sendKanbanTerm()">
                       <i class="fas fa-file-signature"></i> Enviar Termo
                   </button>
              </div>
              <div class="right-actions">
                   <button class="btn btn-sm btn-outline" id="kanban-editCandidateBtn" onclick="toggleKanbanEditMode(true)"><i class="fas fa-pencil-alt"></i> Editar</button>
                   <button class="btn btn-sm btn-primary" id="kanban-saveCandidateBtn" onclick="handleSaveKanbanCandidate()" style="display: none;"><i class="fas fa-save"></i> Salvar</button>
                   <button class="btn btn-sm btn-outline" id="kanban-cancelEditBtn" onclick="toggleKanbanEditMode(false)" style="display: none;">Cancelar</button>
                   <button class="btn btn-sm btn-primary" id="kanban-moveStageBtn"><i class="fas fa-arrow-right"></i> Mover Etapa</button> <!-- Ação a implementar -->
                   <button class="btn btn-sm btn-outline" onclick="closeKanbanModal('kanbanCandidateModal')">Fechar</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Adicionar Lista/Etapa Kanban -->
        <div class="modal-backdrop" id="kanbanAddListModal">
          <div class="modal" style="max-width: 450px;">
            <div class="modal-header">
              <div><h2 class="modal-title">Adicionar Nova Etapa</h2></div>
              <button class="modal-close" onclick="closeKanbanModal('kanbanAddListModal')"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
              <form id="kanban-add-list-form" class="add-list-form">
                <div class="form-group">
                  <label class="form-label" for="kanban-list-title-input">Título da Etapa</label>
                  <input type="text" id="kanban-list-title-input" name="title" class="form-input" placeholder="Ex: Entrevista RH" required>
                </div>
                <div class="form-group">
                  <label class="form-label" for="kanban-list-icon-url-input">URL do Ícone (Opcional)</label>
                  <input type="url" id="kanban-list-icon-url-input" name="iconUrl" class="form-input" placeholder="https://exemplo.com/icone.png">
                </div>
                <div class="form-group">
                  <label class="form-label">Cor da Etapa</label>
                  <div class="color-selector" id="kanban-list-color-selector">
                      <input type="hidden" name="color" id="kanban-list-color-input" value="default">
                      <div class="color-swatch selected" data-color="default" title="Padrão"></div>
                      <div class="color-swatch" data-color="cyan" title="Cyan"></div>
                      <div class="color-swatch" data-color="green" title="Verde"></div>
                      <div class="color-swatch" data-color="orange" title="Laranja"></div>
                      <div class="color-swatch" data-color="purple" title="Roxo"></div>
                      <div class="color-swatch" data-color="lime" title="Lima"></div>
                      <div class="color-swatch" data-color="pink" title="Rosa"></div>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-sm btn-outline cancel-btn" onclick="closeKanbanModal('kanbanAddListModal')">Cancelar</button>
              <button type="submit" form="kanban-add-list-form" class="btn btn-sm btn-primary">Adicionar Etapa</button>
            </div>
          </div>
        </div>
    `;
}


/**
 * Renderiza e inicializa a view Kanban.
 */
async function renderKanbanView() {
    console.log("Renderizando Kanban View...");
    // Adiciona listeners específicos do Kanban
    initKanbanSearch();
    initKanbanModals();
    initKanbanColorSelector();
    // Carrega os dados do Kanban (colunas e cards)
    await loadKanbanData();
    // Inicializa SortableJS após os dados serem carregados e renderizados
    initKanbanSortable();
    // Atualiza estatísticas (exemplo)
    updateKanbanStats(); // Função a ser implementada
    console.log("Kanban View renderizada e inicializada.");
}

/**
 * Carrega colunas e cards do Supabase e renderiza o quadro Kanban.
 */
async function loadKanbanData() {
    console.log("Carregando dados do Kanban (colunas e cards)...");
    const board = document.getElementById('kanbanBoard');
    if (!board) {
        console.error("Elemento #kanbanBoard não encontrado.");
        return;
    }
    board.innerHTML = '<div class="content-placeholder">Carregando quadro...</div>'; // Feedback

    let columns = KANBAN_CONFIG.defaultColumns || []; // Usa colunas padrão da config
    let cards = [];
    let columnsError = null;
    let cardsError = null;

    // Opcional: Buscar colunas do banco de dados se existir uma tabela para elas
    // try {
    //     const { data: columnsData, error } = await supabase.from('kanban_columns').select('*').order('position', { ascending: true });
    //     if (error) throw error;
    //     if (columnsData && columnsData.length > 0) {
    //         columns = columnsData;
    //     }
    // } catch (error) {
    //     columnsError = error;
    //     console.error("Erro ao buscar colunas do Kanban:", error);
    //     showToast("Erro", "Falha ao carregar estrutura do quadro.", "error");
    //     // Continua com as colunas padrão se a busca falhar
    // }

    // Buscar cards da tabela configurada
    try {
        console.log(`Buscando cards da tabela: ${KANBAN_CONFIG.tableName}`);
        const { data: cardsData, error } = await supabase
            .from(KANBAN_CONFIG.tableName)
            .select('*'); // Adicionar filtros ou ordenação se necessário
        if (error) throw error;
        cards = cardsData || [];
        console.log(`${cards.length} cards carregados.`);
    } catch (error) {
        cardsError = error;
        console.error("Erro ao buscar cards do Kanban:", error);
        showToast("Erro", "Falha ao carregar cards.", "error");
    }

    // Limpa o board antes de renderizar
    board.innerHTML = '';

    // Renderiza as colunas
    columns.forEach(column => {
        const columnElement = createKanbanColumnElement(column);
        board.appendChild(columnElement);
    });

    // Renderiza os cards dentro das colunas correspondentes
    cards.forEach(card => {
        const statusValue = card.STATUS || '';
        // Converte status para ID de coluna (ex: "Entrevista" -> "col-entrevista")
        const targetColumnId = `col-${statusValue.toLowerCase().replace(/\s+/g, '-')}`;
        const columnElement = board.querySelector(`.kanban-column[data-column-id="${targetColumnId}"]`);

        if (columnElement) {
            const columnContent = columnElement.querySelector('.column-content');
            const cardElement = createKanbanCardElement(card);
            columnContent.appendChild(cardElement);
        } else {
            console.warn(`Coluna ${targetColumnId} não encontrada para o card ${card.id} (Status: ${card.STATUS})`);
            // Opcional: Adicionar card a uma coluna padrão ou de "não classificados"
        }
    });

    // Adiciona o botão "Nova Etapa" no final
    const addListContainer = document.createElement('div');
    addListContainer.className = 'add-list-container';
    addListContainer.setAttribute('onclick', 'openKanbanModal("kanbanAddListModal")'); // Abre modal específico do Kanban
    addListContainer.innerHTML = `
       <div class="add-list-icon"><i class="fas fa-plus"></i></div>
       <div class="add-list-text">Nova Etapa</div>
    `;
    board.appendChild(addListContainer);

    updateAllKanbanColumnHeaders(); // Atualiza contadores
}

/**
 * Cria o elemento HTML para uma coluna Kanban.
 * @param {object} column - Dados da coluna (id, title, color, iconUrl).
 * @returns {HTMLElement} O elemento da coluna.
 */
function createKanbanColumnElement(column) {
    const columnElement = document.createElement('div');
    columnElement.className = 'kanban-column';
    // Garante que o ID comece com 'col-'
    const columnId = column.id.startsWith('col-') ? column.id : `col-${column.id}`;
    columnElement.dataset.columnId = columnId;
    columnElement.dataset.color = column.color || 'default'; // Cor padrão se não definida
    columnElement.innerHTML = `
      <div class="column-header">
        <div class="column-title">
           ${column.iconUrl ? `<img src="${column.iconUrl}" alt="" class="column-icon">` : '<i class="fas fa-stream default-icon"></i>'}
           ${column.title || 'Sem Título'}
        </div>
        <span class="column-count">(0)</span>
        <div class="column-menu">
             <button class="column-menu-btn delete-column-btn" onclick="deleteKanbanColumn('${columnId}')" title="Excluir Etapa"><i class="fas fa-trash-alt"></i></button>
             <button class="column-menu-btn"><i class="fas fa-ellipsis-h"></i></button> <!-- Botão de menu futuro -->
        </div>
      </div>
      <div class="column-content">
          <!-- Cards serão inseridos aqui -->
      </div>
       <div class="add-card-container" onclick="openKanbanCandidateModal(null, '${columnId}')"> <!-- Passa null e ID da coluna -->
         <div class="add-card-icon"><i class="fas fa-plus"></i></div>
         <div class="add-card-text">Adicionar Card</div>
       </div>
    `;
    return columnElement;
}

/**
 * Cria o elemento HTML para um card Kanban.
 * @param {object} card - Dados do card.
 * @returns {HTMLElement} O elemento do card.
 */
function createKanbanCardElement(card) {
    const cardElement = document.createElement('article');
    cardElement.className = 'candidate-card';
    cardElement.dataset.cardId = card.id;
    cardElement.draggable = true;
    // Onclick principal para abrir o modal de detalhes
    cardElement.setAttribute('onclick', `openKanbanCandidateModal('${card.id}')`);
    cardElement.innerHTML = createKanbanCardInnerHtml(card);

    // Adiciona event listener para parar propagação nos botões de ação dentro do card
    cardElement.querySelectorAll('.card-action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Impede que o clique no botão abra o modal
            const action = btn.title.toLowerCase();
            const cardId = cardElement.dataset.cardId;
            if (action === 'excluir') {
                deleteKanbanCard(cardId);
            } else if (action === 'ver detalhes') {
                 openKanbanCandidateModal(cardId); // Garante que o botão de olho funcione
            }
            // Adicionar outras ações aqui (agendar, avaliar, etc.)
        });
    });
    return cardElement;
}

/**
 * Cria o HTML interno de um card Kanban.
 * @param {object} card - Dados do card.
 * @returns {string} HTML interno do card.
 */
function createKanbanCardInnerHtml(card) {
    const creationDate = formatDate(card.created_at); // Usa utilitário
    const origem = card.motivo_cadastro || 'N/I';
    const initials = getInitials(card.nome); // Usa utilitário

    return `
      <div class="card-header">
        <div class="candidate-info">
          <div class="candidate-avatar">${initials}</div>
          <div class="candidate-name-source">
            <div class="candidate-name" title="${card.nome || ''}">${card.nome || 'Nome Indisponível'}</div>
            <div class="candidate-source-date">
              Origem: ${origem}
            </div>
          </div>
        </div>
        <!-- Menu 3 pontos pode ser adicionado aqui se necessário -->
      </div>
      <div class="card-footer">
          <span class="card-creation-date" title="Data de Criação">${creationDate}</span>
          <div class="card-menu-actions">
              <div class="card-action-group">
                  <button class="card-action-btn" title="Agendar"><i class="fas fa-calendar"></i></button>
                  <button class="card-action-btn" title="Ver Detalhes"><i class="fas fa-eye"></i></button>
                  <button class="card-action-btn" title="Avaliar"><i class="fas fa-star"></i></button>
                  <button class="card-action-btn delete-card-btn" title="Excluir"><i class="fas fa-trash-alt"></i></button>
              </div>
          </div>
      </div>
    `;
}

/**
 * Atualiza o contador de cards no cabeçalho de uma coluna.
 * @param {HTMLElement} columnElement - O elemento da coluna.
 */
function updateKanbanColumnHeader(columnElement) {
    if (!columnElement) return;
    const countElement = columnElement.querySelector('.column-count');
    const cardCount = columnElement.querySelectorAll('.column-content .candidate-card').length;
    if (countElement) {
        countElement.textContent = `(${cardCount})`;
    }
}

/**
 * Atualiza os contadores de todas as colunas Kanban.
 */
function updateAllKanbanColumnHeaders() {
    document.querySelectorAll('#kanbanBoard .kanban-column').forEach(col => {
        updateKanbanColumnHeader(col);
    });
}

/**
 * Inicializa a funcionalidade de busca para o Kanban.
 */
function initKanbanSearch() {
    const searchInput = document.getElementById('kanbanSearchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        const cards = document.querySelectorAll('#kanbanBoard .candidate-card');

        cards.forEach(card => {
            const cardName = card.querySelector('.candidate-name')?.textContent.toLowerCase() || '';
            const cardSource = card.querySelector('.candidate-source-date')?.textContent.toLowerCase() || '';
            // Adicionar mais campos à busca se necessário (ex: tags, ID)
            const isVisible = cardName.includes(searchTerm) || cardSource.includes(searchTerm);
            card.style.display = isVisible ? '' : 'none';
        });
    });
}

/**
 * Inicializa os modais específicos do Kanban.
 */
function initKanbanModals() {
    // Listener para fechar modais Kanban
    document.querySelectorAll('#kanbanCandidateModal .modal-close, #kanbanAddListModal .modal-close, #kanbanAddListModal .cancel-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const modalBackdrop = btn.closest('.modal-backdrop');
            if (modalBackdrop) {
                closeKanbanModal(modalBackdrop.id);
            }
        });
    });

    // Listener para fechar clicando fora do modal Kanban
    document.querySelectorAll('#kanbanCandidateModal, #kanbanAddListModal').forEach(backdrop => {
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                closeKanbanModal(backdrop.id);
            }
        });
    });

    // Listener para formulário de adicionar lista Kanban
    document.getElementById('kanban-add-list-form')?.addEventListener('submit', handleAddKanbanListSubmit);

    // Listeners para abas dentro do modal de candidato Kanban
    initKanbanModalTabs();
}

/**
 * Inicializa as abas dentro do modal de candidato Kanban.
 */
function initKanbanModalTabs() {
    const modal = document.getElementById('kanbanCandidateModal');
    if (!modal) return;
    const tabsContainer = modal.querySelector('.tabs');
    if (!tabsContainer) return;

    tabsContainer.addEventListener('click', (event) => {
        const tabLink = event.target.closest('.tab');
        if (tabLink && tabLink.dataset.tab) {
            const tabId = tabLink.dataset.tab;
            const modalBody = modal.querySelector('.modal-body');
            if (!modalBody) return;

            // Remove active de todas as abas e conteúdos
            tabsContainer.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            modalBody.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            // Adiciona active à aba clicada e ao conteúdo correspondente
            tabLink.classList.add('active');
            const targetPane = modalBody.querySelector(`#${tabId}-tab`);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        }
    });
}


/**
 * Inicializa o seletor de cores no modal de adicionar lista Kanban.
 */
function initKanbanColorSelector() {
    const selector = document.getElementById('kanban-list-color-selector');
    if (!selector) return;
    const input = selector.querySelector('#kanban-list-color-input');
    const swatches = selector.querySelectorAll('.color-swatch');

    swatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            swatches.forEach(s => s.classList.remove('selected'));
            swatch.classList.add('selected');
            if (input) input.value = swatch.dataset.color;
        });
    });
}

/**
 * Abre um modal específico do Kanban.
 * @param {string} modalId - O ID do modal backdrop a ser aberto.
 */
function openKanbanModal(modalId) {
    const modalBackdrop = document.getElementById(modalId);
    if (modalBackdrop) {
        modalBackdrop.style.display = 'flex';
        setTimeout(() => modalBackdrop.classList.add('active'), 10); // Delay para transição CSS
        document.body.style.overflow = "hidden"; // Impede scroll do body
    } else {
        console.error(`Modal Kanban com ID ${modalId} não encontrado.`);
    }
}

/**
 * Fecha um modal específico do Kanban.
 * @param {string} modalId - O ID do modal backdrop a ser fechado.
 */
function closeKanbanModal(modalId) {
    const modalBackdrop = document.getElementById(modalId);
    if (modalBackdrop) {
        modalBackdrop.classList.remove('active');
        modalBackdrop.querySelector('.modal')?.classList.remove('edit-mode'); // Garante remover modo de edição
        setTimeout(() => {
            // Verifica se ainda não está ativo antes de esconder (evita esconder se reaberto rapidamente)
            if (!modalBackdrop.classList.contains('active')) {
                 modalBackdrop.style.display = 'none';
            }
        }, 300); // Tempo da transição CSS
    }
    // Limpa dados do candidato ao fechar o modal principal do Kanban
    if (modalId === 'kanbanCandidateModal') {
        currentKanbanCandidateData = null;
        isNewKanbanCardMode = false;
        initialKanbanCardStatus = null;
    }
    document.body.style.overflow = ""; // Restaura scroll do body
}

/**
 * Abre o modal para adicionar ou editar um candidato no Kanban.
 * @param {string | null} cardId - O ID do card a ser editado, ou null para adicionar um novo.
 * @param {string | null} targetColumnId - O ID da coluna onde adicionar o novo card (opcional).
 */
async function openKanbanCandidateModal(cardId, targetColumnId = null) {
    console.log(`Abrindo modal Kanban para cardId: ${cardId}, targetColumnId: ${targetColumnId}`);
    const modalId = 'kanbanCandidateModal';
    const modalBackdrop = document.getElementById(modalId);
    if (!modalBackdrop) return;
    const modalElement = modalBackdrop.querySelector('.modal');

    isNewKanbanCardMode = cardId === null;

    // Limpa campos e dados anteriores
    currentKanbanCandidateData = null;
    document.querySelectorAll(`#${modalId} .display-field`).forEach(el => el.textContent = '-');
    document.querySelectorAll(`#${modalId} .edit-field`).forEach(el => el.value = '');
    document.getElementById('kanban-modal-idade').textContent = '';
    document.getElementById('kanban-modal-whatsapp-link').style.display = 'none';
    document.getElementById('kanban-modal-activity-log').innerHTML = '<li class="activity-item placeholder"><div class="activity-title">Nenhuma atividade registrada</div></li>';
    document.getElementById('kanban-modal-notes-textarea').value = '';
    document.getElementById('kanban-modal-notes-display').textContent = '-';

    // Garante que a aba de perfil esteja ativa
    modalElement.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    modalElement.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    modalElement.querySelector('.tab[data-tab="profile"]').classList.add('active');
    modalElement.querySelector('#profile-tab').classList.add('active');

    if (isNewKanbanCardMode) {
        // --- MODO ADICIONAR NOVO CARD KANBAN ---
        document.getElementById('kanban-modal-candidate-name').textContent = "Nova Candidata";
        document.getElementById('kanban-modal-candidate-subtitle').textContent = "Preencha os dados abaixo";

        if (targetColumnId) {
            let statusFromCol = targetColumnId.replace(/^col-/, '').replace(/-/g, ' ');
            initialKanbanCardStatus = statusFromCol.charAt(0).toUpperCase() + statusFromCol.slice(1);
            console.log("Status inicial Kanban definido:", initialKanbanCardStatus);
        } else {
            initialKanbanCardStatus = KANBAN_CONFIG.defaultColumns[0]?.title || 'Qualificadas'; // Usa o título da primeira coluna padrão
            console.warn("TargetColumnId não fornecido para novo card Kanban, usando status padrão:", initialKanbanCardStatus);
        }
        // Preenche campos ocultos ou padrão
        document.getElementById('kanban-modal-motivo-cadastro-input').value = 'Manual';
        document.getElementById('kanban-modal-sit-atual-input').value = initialKanbanCardStatus;

        toggleKanbanEditMode(true); // Entra direto no modo de edição
        document.getElementById('kanban-modal-candidate-name-input').focus();

    } else {
        // --- MODO VISUALIZAR/EDITAR CARD KANBAN EXISTENTE ---
        console.log(`Buscando dados Kanban para cardId: ${cardId}`);
        let data = null;
        let error = null;
        try {
            const response = await supabase.from(KANBAN_CONFIG.tableName).select('*').eq('id', cardId).single();
            data = response.data; error = response.error;
        } catch (fetchError) { error = fetchError; }

        if (error || !data) {
            console.error('Erro ao buscar dados Kanban:', error);
            showToast("Erro", 'Erro ao carregar dados da candidata.', "error");
            closeKanbanModal(modalId);
            return;
        }
        currentKanbanCandidateData = data; // Armazena os dados atuais

        // Preenche campos de display E de edição (prefixo 'kanban-modal-')
        document.getElementById('kanban-modal-candidate-name').textContent = data.nome || 'Nome Indisponível';
        document.getElementById('kanban-modal-candidate-name-input').value = data.nome || '';
        document.getElementById('kanban-modal-detail-nome').textContent = data.nome || '-';
        document.getElementById('kanban-modal-detail-nome-input').value = data.nome || '';
        document.getElementById('kanban-modal-candidate-subtitle').textContent = `Situação: ${data.STATUS || data.sit_atual || 'N/I'}`; // Usa STATUS se existir

        // Aba Perfil
        const whatsappNumber = data.whatsapp?.replace(/\D/g, '');
        const whatsappLink = document.getElementById('kanban-modal-whatsapp-link');
        document.getElementById('kanban-modal-whatsapp').textContent = data.whatsapp || '-';
        document.getElementById('kanban-modal-whatsapp-input').value = data.whatsapp || '';
        if (whatsappNumber) { whatsappLink.href = `https://wa.me/55${whatsappNumber}`; whatsappLink.style.display = 'inline-flex'; } // Adiciona 55
        else { whatsappLink.style.display = 'none'; }
        document.getElementById('kanban-modal-dias-livres').textContent = data.dias_livres || '-';
        document.getElementById('kanban-modal-dias-livres-input').value = data.dias_livres || '';
        document.getElementById('kanban-modal-dias-semana').textContent = data.dias_semana || '-';
        document.getElementById('kanban-modal-dias-semana-input').value = data.dias_semana || '';
        document.getElementById('kanban-modal-exp-residencial').textContent = data.exp_residencial || '-';
        document.getElementById('kanban-modal-exp-residencial-input').value = data.exp_residencial || '';
        document.getElementById('kanban-modal-exp-comercial').textContent = data.exp_comercial || '-';
        document.getElementById('kanban-modal-exp-comercial-input').value = data.exp_comercial || '';

        // Aba Dados Completos
        const birthDateStr = data.data_nasc;
        const age = calculateAge(birthDateStr); // Usa utilitário
        document.getElementById('kanban-modal-data-nasc').textContent = birthDateStr ? formatDate(birthDateStr) : '-'; // Formata data
        document.getElementById('kanban-modal-data-nasc-input').value = birthDateStr || ''; // Input mantém formato original ou vazio
        document.getElementById('kanban-modal-idade').textContent = age !== null ? `(${age} anos)` : '';
        document.getElementById('kanban-modal-endereco').textContent = data.endereço || '-';
        document.getElementById('kanban-modal-endereco-input').value = data.endereço || '';
        document.getElementById('kanban-modal-rg').textContent = data.rg || '-';
        document.getElementById('kanban-modal-rg-input').value = data.rg || '';
        document.getElementById('kanban-modal-cpf').textContent = data.cpf || '-';
        document.getElementById('kanban-modal-cpf-input').value = data.cpf || '';
        document.getElementById('kanban-modal-est-civil').textContent = data.estado_civil || '-';
        document.getElementById('kanban-modal-est-civil-input').value = data.estado_civil || '';
        document.getElementById('kanban-modal-filhos').textContent = data.filhos || '-';
        document.getElementById('kanban-modal-filhos-input').value = data.filhos || '';
        document.getElementById('kanban-modal-rotina-filhos').textContent = data.rotina_filhos || '-';
        document.getElementById('kanban-modal-rotina-filhos-input').value = data.rotina_filhos || '';
        document.getElementById('kanban-modal-fumante').textContent = data.fumante || '-';
        document.getElementById('kanban-modal-fumante-input').value = data.fumante || '';
        document.getElementById('kanban-modal-pet').textContent = data.rest_pet || '-';
        document.getElementById('kanban-modal-pet-input').value = data.rest_pet || '';
        document.getElementById('kanban-modal-transporte').textContent = data.transporte || '-';
        document.getElementById('kanban-modal-transporte-input').value = data.transporte || '';
        document.getElementById('kanban-modal-sit-atual').textContent = data.sit_atual || '-';
        document.getElementById('kanban-modal-sit-atual-input').value = data.sit_atual || '';
        document.getElementById('kanban-modal-motivo-cadastro').textContent = data.motivo_cadastro || '-';
        document.getElementById('kanban-modal-motivo-cadastro-input').value = data.motivo_cadastro || '';

        // Aba Notas (Exemplo: usar coluna 'observacoes')
        document.getElementById('kanban-modal-notes-display').textContent = data.observacoes || '-';
        document.getElementById('kanban-modal-notes-textarea').value = data.observacoes || '';

        // Aba Atividades (Carregar do banco - Função a ser criada)
        // loadKanbanActivityLog(cardId);

        toggleKanbanEditMode(false); // Inicia no modo de visualização
        document.getElementById('kanban-send-term-btn').dataset.candidateId = cardId; // Configura ID para botão Enviar Termo
    }

    openKanbanModal(modalId); // Abre o modal
}


/**
 * Alterna o modo de edição no modal de candidato Kanban.
 * @param {boolean} editing - True para entrar no modo de edição, false para sair.
 */
function toggleKanbanEditMode(editing) {
    const modal = document.getElementById('kanbanCandidateModal');
    if (!modal) return;
    const modalElement = modal.querySelector('.modal');
    modalElement.classList.toggle('edit-mode', editing);

    // Controla visibilidade dos botões
    document.getElementById('kanban-editCandidateBtn').style.display = editing ? 'none' : (isNewKanbanCardMode ? 'none' : 'inline-flex');
    document.getElementById('kanban-saveCandidateBtn').style.display = editing ? 'inline-flex' : 'none';
    document.getElementById('kanban-cancelEditBtn').style.display = editing ? 'inline-flex' : 'none';
    document.getElementById('kanban-moveStageBtn').style.display = editing ? 'none' : 'inline-flex';
    document.getElementById('kanban-rejectCandidateBtn').style.display = editing ? 'none' : 'inline-flex';
    document.getElementById('kanban-send-term-btn').style.display = editing ? 'none' : 'inline-flex';

    // Foca no primeiro campo editável ao entrar no modo de edição
    if (editing) {
        setTimeout(() => {
             modalElement.querySelector('.edit-field:not([type="hidden"])')?.focus();
        }, 50);
    } else if (!isNewKanbanCardMode && currentKanbanCandidateData) {
        // Ao sair do modo de edição (cancelar), restaura os valores dos inputs para os dados originais
        document.getElementById('kanban-modal-candidate-name-input').value = currentKanbanCandidateData.nome || '';
        document.getElementById('kanban-modal-detail-nome-input').value = currentKanbanCandidateData.nome || '';
        document.getElementById('kanban-modal-whatsapp-input').value = currentKanbanCandidateData.whatsapp || '';
        document.getElementById('kanban-modal-dias-livres-input').value = currentKanbanCandidateData.dias_livres || '';
        document.getElementById('kanban-modal-dias-semana-input').value = currentKanbanCandidateData.dias_semana || '';
        document.getElementById('kanban-modal-exp-residencial-input').value = currentKanbanCandidateData.exp_residencial || '';
        document.getElementById('kanban-modal-exp-comercial-input').value = currentKanbanCandidateData.exp_comercial || '';
        document.getElementById('kanban-modal-data-nasc-input').value = currentKanbanCandidateData.data_nasc || '';
        document.getElementById('kanban-modal-endereco-input').value = currentKanbanCandidateData.endereço || '';
        document.getElementById('kanban-modal-rg-input').value = currentKanbanCandidateData.rg || '';
        document.getElementById('kanban-modal-cpf-input').value = currentKanbanCandidateData.cpf || '';
        document.getElementById('kanban-modal-est-civil-input').value = currentKanbanCandidateData.estado_civil || '';
        document.getElementById('kanban-modal-filhos-input').value = currentKanbanCandidateData.filhos || '';
        document.getElementById('kanban-modal-rotina-filhos-input').value = currentKanbanCandidateData.rotina_filhos || '';
        document.getElementById('kanban-modal-fumante-input').value = currentKanbanCandidateData.fumante || '';
        document.getElementById('kanban-modal-pet-input').value = currentKanbanCandidateData.rest_pet || '';
        document.getElementById('kanban-modal-transporte-input').value = currentKanbanCandidateData.transporte || '';
        document.getElementById('kanban-modal-sit-atual-input').value = currentKanbanCandidateData.sit_atual || '';
        document.getElementById('kanban-modal-motivo-cadastro-input').value = currentKanbanCandidateData.motivo_cadastro || '';
        document.getElementById('kanban-modal-notes-textarea').value = currentKanbanCandidateData.observacoes || '';
    } else if (isNewKanbanCardMode) {
        // Se cancelou a criação de um novo card, apenas fecha o modal
        closeKanbanModal('kanbanCandidateModal');
    }
}


/**
 * Salva os dados do candidato (novo ou existente) do modal Kanban no Supabase.
 */
async function handleSaveKanbanCandidate() {
    const modal = document.getElementById('kanbanCandidateModal');
    const saveButton = document.getElementById('kanban-saveCandidateBtn');
    if (!modal || !saveButton) return;

    saveButton.disabled = true;
    saveButton.innerHTML = `<svg class="icon icon-spin" viewBox="0 0 24 24"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg> Salvando...`;

    // Coleta dados dos inputs do modal Kanban (prefixo 'kanban-modal-')
    const payload = {
        nome: document.getElementById('kanban-modal-candidate-name-input').value.trim() || document.getElementById('kanban-modal-detail-nome-input').value.trim(),
        whatsapp: document.getElementById('kanban-modal-whatsapp-input').value.trim(),
        dias_livres: document.getElementById('kanban-modal-dias-livres-input').value.trim(),
        dias_semana: document.getElementById('kanban-modal-dias-semana-input').value.trim(),
        exp_residencial: document.getElementById('kanban-modal-exp-residencial-input').value.trim(),
        exp_comercial: document.getElementById('kanban-modal-exp-comercial-input').value.trim(),
        data_nasc: document.getElementById('kanban-modal-data-nasc-input').value.trim() || null, // Envia null se vazio
        endereço: document.getElementById('kanban-modal-endereco-input').value.trim(),
        rg: document.getElementById('kanban-modal-rg-input').value.trim(),
        cpf: document.getElementById('kanban-modal-cpf-input').value.trim(),
        estado_civil: document.getElementById('kanban-modal-est-civil-input').value.trim(),
        filhos: document.getElementById('kanban-modal-filhos-input').value.trim(),
        rotina_filhos: document.getElementById('kanban-modal-rotina-filhos-input').value.trim(),
        fumante: document.getElementById('kanban-modal-fumante-input').value.trim(),
        rest_pet: document.getElementById('kanban-modal-pet-input').value.trim(),
        transporte: document.getElementById('kanban-modal-transporte-input').value.trim(),
        sit_atual: document.getElementById('kanban-modal-sit-atual-input').value.trim(),
        motivo_cadastro: document.getElementById('kanban-modal-motivo-cadastro-input').value.trim(),
        observacoes: document.getElementById('kanban-modal-notes-textarea').value.trim()
    };

    // Validação básica (ex: nome obrigatório)
    if (!payload.nome) {
        showToast("Erro", "O nome da candidata é obrigatório.", "error");
        saveButton.disabled = false;
        saveButton.innerHTML = `<i class="fas fa-save"></i> Salvar`;
        document.getElementById('kanban-modal-candidate-name-input').focus();
        return;
    }

    try {
        let resultData;
        let error;

        if (isNewKanbanCardMode) {
            // --- MODO INSERT KANBAN ---
            payload.STATUS = initialKanbanCardStatus || KANBAN_CONFIG.defaultColumns[0]?.title || 'Qualificadas'; // Status inicial
            console.log("Inserindo novo card Kanban:", payload);
            const { data: insertData, error: insertError } = await supabase
                .from(KANBAN_CONFIG.tableName)
                .insert([payload])
                .select()
                .single();
            resultData = insertData;
            error = insertError;

            if (!error && resultData) {
                showToast("Sucesso", `Candidata ${resultData.nome} adicionada com sucesso!`);
                renderNewKanbanCard(resultData); // Adiciona o card visualmente
                closeKanbanModal('kanbanCandidateModal');
            }

        } else {
            // --- MODO UPDATE KANBAN ---
            const cardIdToUpdate = currentKanbanCandidateData?.id;
            if (!cardIdToUpdate) throw new Error("ID do candidato não encontrado para atualização.");

            // Remove o campo STATUS do payload de update, pois ele é atualizado pelo drag-and-drop
            // delete payload.STATUS;
            // Mantém o STATUS atual se não for alterado por drag-n-drop
            payload.STATUS = currentKanbanCandidateData.STATUS;


            console.log(`Atualizando card Kanban ID ${cardIdToUpdate}:`, payload);
            const { data: updateData, error: updateError } = await supabase
                .from(KANBAN_CONFIG.tableName)
                .update(payload)
                .eq('id', cardIdToUpdate)
                .select()
                .single();
            resultData = updateData;
            error = updateError;

            if (!error && resultData) {
                showToast("Sucesso", `Dados de ${resultData.nome} atualizados!`);
                updateKanbanCardElement(resultData); // Atualiza a visualização do card
                currentKanbanCandidateData = resultData; // Atualiza dados locais
                // Re-preenche spans de display no modal antes de sair do modo de edição
                fillKanbanModalDisplayFields(resultData);
                toggleKanbanEditMode(false); // Volta para modo visualização
            }
        }

        if (error) throw error; // Joga o erro para o catch

    } catch (err) {
        console.error("Erro ao salvar dados Kanban:", err);
        showToast("Erro", `Falha ao salvar: ${err.message}`, "error");
    } finally {
        saveButton.disabled = false;
        saveButton.innerHTML = `<i class="fas fa-save"></i> Salvar`;
    }
}

/**
 * Preenche os campos de display no modal Kanban com os dados fornecidos.
 * @param {object} data - Os dados do candidato.
 */
function fillKanbanModalDisplayFields(data) {
    if (!data) return;
    const modalId = 'kanbanCandidateModal';
    document.getElementById('kanban-modal-candidate-name').textContent = data.nome || 'Nome Indisponível';
    document.getElementById('kanban-modal-detail-nome').textContent = data.nome || '-';
    document.getElementById('kanban-modal-candidate-subtitle').textContent = `Situação: ${data.STATUS || data.sit_atual || 'N/I'}`;
    document.getElementById('kanban-modal-whatsapp').textContent = data.whatsapp || '-';
    const whatsappNumber = data.whatsapp?.replace(/\D/g, '');
    const whatsappLink = document.getElementById('kanban-modal-whatsapp-link');
    if (whatsappNumber) { whatsappLink.href = `https://wa.me/55${whatsappNumber}`; whatsappLink.style.display = 'inline-flex'; }
    else { whatsappLink.style.display = 'none'; }
    document.getElementById('kanban-modal-dias-livres').textContent = data.dias_livres || '-';
    document.getElementById('kanban-modal-dias-semana').textContent = data.dias_semana || '-';
    document.getElementById('kanban-modal-exp-residencial').textContent = data.exp_residencial || '-';
    document.getElementById('kanban-modal-exp-comercial').textContent = data.exp_comercial || '-';
    const birthDateStr = data.data_nasc;
    const age = calculateAge(birthDateStr);
    document.getElementById('kanban-modal-data-nasc').textContent = birthDateStr ? formatDate(birthDateStr) : '-';
    document.getElementById('kanban-modal-idade').textContent = age !== null ? `(${age} anos)` : '';
    document.getElementById('kanban-modal-endereco').textContent = data.endereço || '-';
    document.getElementById('kanban-modal-rg').textContent = data.rg || '-';
    document.getElementById('kanban-modal-cpf').textContent = data.cpf || '-';
    document.getElementById('kanban-modal-est-civil').textContent = data.estado_civil || '-';
    document.getElementById('kanban-modal-filhos').textContent = data.filhos || '-';
    document.getElementById('kanban-modal-rotina-filhos').textContent = data.rotina_filhos || '-';
    document.getElementById('kanban-modal-fumante').textContent = data.fumante || '-';
    document.getElementById('kanban-modal-pet').textContent = data.rest_pet || '-';
    document.getElementById('kanban-modal-transporte').textContent = data.transporte || '-';
    document.getElementById('kanban-modal-sit-atual').textContent = data.sit_atual || '-';
    document.getElementById('kanban-modal-motivo-cadastro').textContent = data.motivo_cadastro || '-';
    document.getElementById('kanban-modal-notes-display').textContent = data.observacoes || '-';
}


/**
 * Renderiza um novo card Kanban na coluna correta.
 * @param {object} cardData - Dados do card inserido.
 */
function renderNewKanbanCard(cardData) {
    const statusValue = cardData.STATUS || '';
    const targetColumnId = `col-${statusValue.toLowerCase().replace(/\s+/g, '-')}`;
    const columnElement = document.querySelector(`.kanban-column[data-column-id="${targetColumnId}"]`);

    if (columnElement) {
        const columnContent = columnElement.querySelector('.column-content');
        const cardElement = createKanbanCardElement(cardData);
        columnContent.appendChild(cardElement);
        updateKanbanColumnHeader(columnElement); // Atualiza contador
    } else {
        console.warn(`Coluna ${targetColumnId} não encontrada para o novo card Kanban ${cardData.id}`);
        // Opcional: Adicionar a uma coluna padrão
        const defaultColumn = document.querySelector('#kanbanBoard .kanban-column');
        if (defaultColumn) {
            defaultColumn.querySelector('.column-content').appendChild(createKanbanCardElement(cardData));
            updateKanbanColumnHeader(defaultColumn);
            showToast("Aviso", `Card adicionado à coluna padrão, pois a coluna "${statusValue}" não foi encontrada.`, "warning");
        }
    }
}

/**
 * Atualiza um card Kanban existente no DOM.
 * @param {object} cardData - Dados atualizados do card.
 */
function updateKanbanCardElement(cardData) {
    const cardElement = document.querySelector(`.candidate-card[data-card-id="${cardData.id}"]`);
    if (cardElement) {
        // Recria o conteúdo interno do card com os dados atualizados
        cardElement.innerHTML = createKanbanCardInnerHtml(cardData);
        // Adiciona novamente os listeners aos botões internos
        cardElement.querySelectorAll('.card-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.title.toLowerCase();
                const cardId = cardElement.dataset.cardId;
                if (action === 'excluir') {
                    deleteKanbanCard(cardId);
                } else if (action === 'ver detalhes') {
                     openKanbanCandidateModal(cardId);
                }
            });
        });

        // Se o STATUS mudou (geralmente via drag-and-drop, mas pode ocorrer aqui), move o card
        const currentColumn = cardElement.closest('.kanban-column');
        const statusValue = cardData.STATUS || '';
        const targetColumnId = `col-${statusValue.toLowerCase().replace(/\s+/g, '-')}`;

        if (currentColumn && currentColumn.dataset.columnId !== targetColumnId) {
            const targetColumn = document.querySelector(`.kanban-column[data-column-id="${targetColumnId}"]`);
            if (targetColumn) {
                targetColumn.querySelector('.column-content').appendChild(cardElement);
                updateKanbanColumnHeader(currentColumn);
                updateKanbanColumnHeader(targetColumn);
                console.log(`Card ${cardData.id} movido para a coluna ${targetColumnId} após atualização.`);
            } else {
                 console.warn(`Coluna ${targetColumnId} não encontrada para mover o card ${cardData.id} após atualização.`);
            }
        }
    }
}


/**
 * Deleta um card Kanban do DOM e do Supabase.
 * @param {string} cardId - O ID do card a ser deletado.
 */
async function deleteKanbanCard(cardId) {
    if (!confirm(`Tem certeza que deseja excluir o card ID ${cardId}? Esta ação não pode ser desfeita.`)) {
        return;
    }

    console.log(`Excluindo card Kanban ID ${cardId}...`);
    try {
        const { error } = await supabase
            .from(KANBAN_CONFIG.tableName)
            .delete()
            .eq('id', cardId);

        if (error) throw error;

        // Remove o elemento do DOM
        const cardElement = document.querySelector(`.candidate-card[data-card-id="${cardId}"]`);
        if (cardElement) {
            const columnElement = cardElement.closest('.kanban-column');
            cardElement.remove();
            updateKanbanColumnHeader(columnElement); // Atualiza contador da coluna
            showToast("Sucesso", `Card ${cardId} excluído.`);
        }
    } catch (err) {
        console.error("Erro ao excluir card Kanban:", err);
        showToast("Erro", `Falha ao excluir card: ${err.message}`, "error");
    }
}

/**
 * Deleta uma coluna Kanban do DOM.
 * (A lógica de deletar do banco de dados precisaria ser implementada se as colunas fossem persistidas)
 * @param {string} columnId - O ID da coluna a ser deletada.
 */
async function deleteKanbanColumn(columnId) {
     const columnElement = document.querySelector(`.kanban-column[data-column-id="${columnId}"]`);
     if (!columnElement) {
         showToast("Erro", `Coluna ${columnId} não encontrada.`, "error");
         return;
     }
     const columnTitle = columnElement.querySelector('.column-title')?.textContent.trim() || columnId;
     const cardCount = columnElement.querySelectorAll('.candidate-card').length;

     let confirmationMessage = `Tem certeza que deseja excluir a etapa "${columnTitle}"?`;
     if (cardCount > 0) {
         confirmationMessage += `\n\nAVISO: Esta coluna contém ${cardCount} card(s). Eles serão removidos visualmente do quadro.`;
     }
     confirmationMessage += "\n\nEsta ação não pode ser desfeita visualmente.";


     if (!confirm(confirmationMessage)) {
         return;
     }

     console.log(`Excluindo coluna Kanban ID ${columnId}...`);
     columnElement.remove();
     // TODO: Adicionar lógica para deletar coluna no banco de dados (se aplicável)
     // Ex: const { error } = await supabase.from('kanban_columns').delete().eq('id', columnId);
     showToast("Sucesso", `Etapa "${columnTitle}" removida visualmente.`);
     // Re-inicializar SortableJS para o board pode ser necessário se a ordem for salva
     // initKanbanSortable();
}


/**
 * Lida com o submit do formulário de adicionar nova etapa Kanban.
 * @param {Event} event - O evento de submit do formulário.
 */
async function handleAddKanbanListSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const title = form.querySelector('#kanban-list-title-input').value.trim();
    const color = form.querySelector('#kanban-list-color-input').value;
    const iconUrl = form.querySelector('#kanban-list-icon-url-input').value.trim();

    if (!title) return;

    // Cria o ID da coluna a partir do título
    const columnId = `col-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'nova-etapa'}`;

    // Verifica se coluna com mesmo ID já existe
    if (document.querySelector(`.kanban-column[data-column-id="${columnId}"]`)) {
        showToast("Erro", `Uma etapa com ID "${columnId}" (derivado de "${title}") já existe.`, "error");
        return;
    }

    const newColumnData = { id: columnId, title, color, iconUrl };
    const newColumnElement = createKanbanColumnElement(newColumnData);

    const board = document.getElementById('kanbanBoard');
    const addListBtnContainer = board.querySelector('.add-list-container');
    board.insertBefore(newColumnElement, addListBtnContainer); // Insere antes do botão '+'

    initKanbanSortable(); // Re-inicializa sortable para incluir a nova coluna
    updateKanbanColumnHeader(newColumnElement); // Define contador inicial (0)
    closeKanbanModal('kanbanAddListModal');
    form.reset(); // Limpa o formulário

    // Opcional: Inserir nova coluna no Supabase
    console.log('Nova coluna Kanban adicionada visualmente:', newColumnData);
    // try {
    //     const { error } = await supabase.from('kanban_columns').insert([{ id: columnId, title, color, icon_url: iconUrl /*, position: ... */}]);
    //     if (error) throw error;
    //     showToast("Sucesso", `Etapa "${title}" adicionada.`);
    // } catch (error) {
    //     console.error('Erro ao salvar nova coluna Kanban:', error);
    //     showToast("Erro", `Falha ao salvar a nova etapa no banco: ${error.message}`, "error");
    //     // Opcional: Remover a coluna adicionada visualmente se a persistência falhar
    //     newColumnElement.remove();
    // }
}

/**
 * Inicializa o SortableJS para as colunas e cards do Kanban.
 */
function initKanbanSortable() {
    // Destroi instâncias anteriores para evitar duplicação
    kanbanSortableInstances.forEach(instance => instance.destroy());
    kanbanSortableInstances = [];

    // Habilita drag-and-drop para cards entre colunas
    const columnsContent = document.querySelectorAll('#kanbanBoard .kanban-column .column-content');
    columnsContent.forEach(colContent => {
        const sortable = new Sortable(colContent, {
            group: 'kanban-cards', // Nome do grupo para cards
            animation: 150,
            ghostClass: 'sortable-ghost', // Classe para o placeholder do card
            chosenClass: 'dragging',      // Classe para o card sendo arrastado
            onEnd: handleKanbanCardDrop   // Função chamada ao soltar o card
        });
        kanbanSortableInstances.push(sortable);
    });

     // Habilita drag-and-drop para reordenar colunas
     const board = document.getElementById('kanbanBoard');
     if (board) {
         const boardSortable = new Sortable(board, {
             group: 'kanban-columns', // Nome do grupo para colunas
             animation: 150,
             handle: '.column-header', // Permite arrastar pelo cabeçalho da coluna
             filter: '.add-list-container', // Impede que o botão '+' seja arrastado
             onEnd: handleKanbanColumnDrop // Função chamada ao soltar a coluna
         });
         kanbanSortableInstances.push(boardSortable);
     }
     console.log("SortableJS inicializado para Kanban.");
}

/**
 * Lida com o evento de soltar um card Kanban em uma coluna.
 * @param {Sortable.SortableEvent} evt - O evento do SortableJS.
 */
async function handleKanbanCardDrop(evt) {
    const cardElement = evt.item;
    const cardId = cardElement.dataset.cardId;
    const fromColumnEl = evt.from.closest('.kanban-column');
    const toColumnEl = evt.to.closest('.kanban-column');
    const toColumnId = toColumnEl.dataset.columnId;

    if (!cardId || !fromColumnEl || !toColumnEl) {
        console.error("Erro no drop: Elementos ou IDs não encontrados.", { cardId, fromColumnEl, toColumnEl });
        return; // Sai se algo estiver faltando
    }

    const fromColumnId = fromColumnEl.dataset.columnId;

    // Não faz nada se soltar na mesma coluna
    if (fromColumnId === toColumnId) {
        console.log(`Card ${cardId} solto na mesma coluna (${toColumnId}). Nenhuma ação necessária.`);
        return;
    }

    console.log(`Card ${cardId} movido de ${fromColumnId} para ${toColumnId}`);

    // Determina o novo STATUS baseado no ID da coluna de destino
    let novoStatus = toColumnId.replace(/^col-/, '').replace(/-/g, ' ');
    novoStatus = novoStatus.charAt(0).toUpperCase() + novoStatus.slice(1); // Capitaliza

    console.log(`Atualizando STATUS do card ${cardId} para "${novoStatus}" no Supabase...`);

    try {
        const { error } = await supabase
            .from(KANBAN_CONFIG.tableName)
            .update({ STATUS: novoStatus }) // Atualiza apenas o campo STATUS
            .eq('id', cardId);

        if (error) {
            console.error('Erro ao atualizar status Kanban no Supabase:', error);
            showToast("Erro", `Erro ao mover card: ${error.message}`, "error");
            // Reverte visualmente movendo o card de volta para a coluna original
            evt.from.appendChild(cardElement);
            updateKanbanColumnHeader(fromColumnEl); // Atualiza contador da origem
            updateKanbanColumnHeader(toColumnEl);   // Atualiza contador do destino (que falhou)
        } else {
            console.log(`Card ${cardId} atualizado para STATUS "${novoStatus}" com sucesso.`);
            // Atualiza contadores das colunas de origem e destino
            updateKanbanColumnHeader(fromColumnEl);
            updateKanbanColumnHeader(toColumnEl);
            // Atualiza o subtítulo no modal se ele estiver aberto para este card
            if (currentKanbanCandidateData && currentKanbanCandidateData.id === cardId) {
                 currentKanbanCandidateData.STATUS = novoStatus; // Atualiza dado local
                 const subtitleElement = document.getElementById('kanban-modal-candidate-subtitle');
                 if (subtitleElement) {
                     subtitleElement.textContent = `Situação: ${novoStatus}`;
                 }
            }
        }
    } catch (updateError) {
         console.error('Erro GERAL ao tentar atualizar status Kanban no Supabase:', updateError);
         showToast("Erro", 'Ocorreu um erro inesperado ao mover o card.', "error");
         // Reverte visualmente
         evt.from.appendChild(cardElement);
         updateKanbanColumnHeader(fromColumnEl);
         updateKanbanColumnHeader(toColumnEl);
    }
}

/**
 * Lida com o evento de soltar uma coluna Kanban.
 * @param {Sortable.SortableEvent} evt - O evento do SortableJS.
 */
function handleKanbanColumnDrop(evt) {
     console.log('Coluna movida:', evt.item.dataset.columnId, 'Nova posição:', evt.newIndex);
     // TODO: Implementar lógica para salvar a nova ordem das colunas no banco de dados,
     // se a ordem das colunas for persistida.
     // Exemplo:
     // const columns = Array.from(evt.to.querySelectorAll('.kanban-column'));
     // const columnOrder = columns.map((col, index) => ({ id: col.dataset.columnId, position: index }));
     // await supabase.from('kanban_columns').upsert(columnOrder); // Usaria upsert para atualizar posições
}

/**
 * Atualiza as estatísticas do Kanban (placeholder).
 */
function updateKanbanStats() {
    // TODO: Implementar lógica para buscar/calcular estatísticas reais
    // Exemplo: Contar cards por status no último mês
    document.getElementById('stat-candidatas-mes').textContent = '35'; // Mock
    document.getElementById('stat-aprovadas').textContent = '8'; // Mock
    document.getElementById('stat-nao-aprovadas').textContent = '12'; // Mock
    document.getElementById('stat-desistentes').textContent = '5'; // Mock
    console.log("Estatísticas do Kanban atualizadas (mock).");
}

/**
 * Envia o termo de aceite para o candidato (placeholder).
 */
function sendKanbanTerm() {
    const btn = document.getElementById('kanban-send-term-btn');
    const candidateId = btn?.dataset.candidateId;

    if (!currentKanbanCandidateData || !candidateId || currentKanbanCandidateData.id !== candidateId) {
        console.error("Dados da candidata Kanban não carregados ou inconsistentes para enviar termo.");
        showToast("Erro", "Não foi possível obter os dados da candidata.", "error");
        return;
    }

    const payload = {
        nome: currentKanbanCandidateData.nome,
        rg: currentKanbanCandidateData.rg,
        cpf: currentKanbanCandidateData.cpf,
        endereco: currentKanbanCandidateData.endereço
    };

    if (!payload.nome || !payload.rg || !payload.cpf || !payload.endereco) {
         console.error("Dados incompletos para enviar termo Kanban:", payload);
         showToast("Erro", "Dados essenciais (Nome, RG, CPF, Endereço) estão faltando.", "error");
         return;
    }

    // TODO: Implementar chamada real ao webhook ou função backend
    // triggerWebhook('enviar_termo_aceite_kanban', payload); // Usar função de webhook se existir
    console.log("// TODO: Implementar envio real do termo Kanban via webhook/backend", payload);
    showToast("Sucesso", `Simulando envio de termo para ${payload.nome}.`);

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-check"></i> Enviado';
    setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-file-signature"></i> Enviar Termo';
    }, 3000);
}


console.log("Kanban JS carregado.");
