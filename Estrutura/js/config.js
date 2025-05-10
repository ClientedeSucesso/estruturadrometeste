// Supabase Configuration
const SUPABASE_URL = 'https://nehmpbytxsvmsevrxvxa.supabase.co';
// IMPORTANT: This is the ANON key, safe for client-side use.
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5laG1wYnl0eHN2bXNldnJ4dnhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MzAzNjQsImV4cCI6MjA1ODUwNjM2NH0.ON909zob-MWAMf2Cm6Sd7EzqbNxaVzXntB6vX57isMM';

// --- Configurações do Painel de Status ---
// Renomeado para evitar conflito e manter clareza
const STATUS_PANEL_CONFIG = {
    empresaPadrao: "MB Dromedario", // Empresa que carrega por padrão
    empresas: {
        "MB Dromedario": {
            nome: "MB Dromedario",
            // webhookUrl: "https://app.dromeflow.com/webhook/drome-start", // Mover para backend/config segura
            tableName: "status_drome",
            addprofissionalTable: "profissionais_drome"
        },
        "MB Londrina": { // Exemplo de outra empresa
            nome: "MB Londrina",
            // webhookUrl: "https://app.dromeflow.com/webhook/londrina-start", // Mover para backend/config segura
            tableName: "status_londrina", // Exemplo: tabela diferente
            addprofissionalTable: "profissionais_londrina" // Exemplo: tabela diferente
        }
        // Adicionar outras empresas aqui
    },
    // Cabeçalhos esperados do banco de dados para o painel de status
    expectedDbHeaders: ['DATA', 'HORARIO', 'MOMENTO', 'SERVIÇO', 'TIPO', 'PERÍODO', 'CLIENTE', 'PROFISSIONAL', 'ENDEREÇO', 'DIA', 'STATUS', 'whatscliente', 'id'], // Adicionado 'id' e 'whatscliente'
    // Cabeçalhos a serem exibidos na tabela de edição do sheet
    displayTableHeaders: ['DATA', 'HORARIO', 'MOMENTO', 'SERVIÇO', 'TIPO', 'PERÍODO', 'CLIENTE', 'PROFISSIONAL', 'ENDEREÇO', 'DIA', 'STATUS', 'AÇÕES'] // Coluna 'AÇÕES' para botões
};

// --- Configurações do Kanban ---
const KANBAN_CONFIG = {
    tableName: 'drome_recruta', // Tabela para os cards do Kanban
    // Colunas padrão (podem ser carregadas do banco de dados se houver uma tabela para elas)
    defaultColumns: [
        { id: 'col-qualificadas', title: 'Qualificadas', color: 'cyan', iconUrl: null },
        { id: 'col-triagem', title: 'Triagem', color: 'green', iconUrl: null },
        { id: 'col-entrevista', title: 'Entrevista', color: 'orange', iconUrl: null },
        { id: 'col-contratada', title: 'Contratada', color: 'purple', iconUrl: null },
        { id: 'col-rejeitada', title: 'Rejeitada', color: 'pink', iconUrl: null },
    ]
};

// --- Outras Configurações Globais ---
const APP_CONFIG = {
    defaultTheme: 'dark',
    defaultView: 'kanban' // View que carrega inicialmente
};

// Inicialização do Cliente Supabase (usando a chave anônima)
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("Configurações carregadas.");
// Exemplo de como acessar: STATUS_PANEL_CONFIG.empresaPadrao
// Exemplo de como acessar: KANBAN_CONFIG.tableName
// Exemplo de como acessar: supabase (cliente inicializado)
