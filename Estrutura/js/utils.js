/**
 * Exibe uma notificação toast na tela.
 * @param {string} title Título do toast.
 * @param {string} description Descrição do toast.
 * @param {'success' | 'error' | 'warning' | 'info'} type Tipo do toast (afeta a cor da borda).
 */
function showToast(title, description, type = "success") {
    const toastContainer = document.getElementById("toastContainer");
    if (!toastContainer) {
        console.error("Elemento #toastContainer não encontrado para exibir o toast.");
        return;
    }
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`; // Usa classes CSS definidas em style.css
    toast.innerHTML = `<div class="toast-title">${title}</div><div class="toast-description">${description}</div>`;
    toastContainer.appendChild(toast);

    // Remove o toast após 5 segundos
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            if (toast.parentNode === toastContainer) { // Verifica se ainda existe
                 toast.remove();
            }
        }, 300); // Tempo da transição CSS
    }, 5000);
}

/**
 * Formata uma string de data/hora (ISO ou similar) para DD/MM/AAAA.
 * @param {string | Date} dateString String da data ou objeto Date.
 * @returns {string} Data formatada ou '-' se inválida.
 */
function formatDate(dateString) {
    if (!dateString) return '-';
    try {
        const date = new Date(dateString);
        // Verifica se a data é válida
        if (isNaN(date.getTime())) {
             // Tenta tratar como número Excel (se aplicável e necessário)
             if (typeof dateString === 'number' && dateString > 10000) {
                 const excelEpochDiff = 25569;
                 const jsTimestamp = (dateString - excelEpochDiff) * 86400000;
                 const excelDate = new Date(jsTimestamp);
                 const timezoneOffset = excelDate.getTimezoneOffset() * 60000;
                 const adjustedDate = new Date(excelDate.getTime() + timezoneOffset);
                 if (!isNaN(adjustedDate.getTime())) {
                     return adjustedDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
                 }
             }
             return '-'; // Retorna '-' se não for data válida nem número Excel
        }

        // Ajusta para UTC se a string não tiver timezone explícito (evita problemas de fuso)
        // Isso pode precisar de ajuste dependendo de como as datas são salvas no DB
        // const year = date.getUTCFullYear();
        // const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        // const day = String(date.getUTCDate()).padStart(2, '0');
        // return `${day}/${month}/${year}`;

        // Usando toLocaleDateString para formato local (mais simples)
        return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

    } catch (e) {
        console.error("Erro ao formatar data:", dateString, e);
        return '-';
    }
}

/**
 * Calcula a idade a partir de uma string de data de nascimento.
 * @param {string} birthDateString Data de nascimento (espera DD/MM/AAAA ou formato reconhecido por new Date()).
 * @returns {number | null} Idade calculada ou null se inválida.
 */
function calculateAge(birthDateString) {
    if (!birthDateString) return null;
    try {
        let birthDate;
        // Tenta parsear DD/MM/AAAA primeiro
        if (String(birthDateString).includes('/')) {
            const parts = birthDateString.split('/');
            if (parts.length === 3 && parts[0].length <= 2 && parts[1].length <= 2 && parts[2].length === 4) {
                // Formato DD/MM/AAAA -> MM/DD/AAAA para o construtor Date
                birthDate = new Date(`${parts[1]}/${parts[0]}/${parts[2]}`);
            } else {
                 birthDate = new Date(birthDateString); // Tenta parse direto
            }
        } else {
            birthDate = new Date(birthDateString); // Tenta parse direto (ISO, etc.)
        }

        // Verifica se o parse resultou em uma data válida
        if (isNaN(birthDate.getTime())) {
             console.warn("Data de nascimento inválida para cálculo de idade:", birthDateString);
             return null;
        }

        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        // Ajusta a idade se o aniversário ainda não ocorreu este ano
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    } catch (e) {
        console.error("Erro ao calcular idade:", birthDateString, e);
        return null;
    }
}

/**
 * Formata o nome do cliente removendo números e texto após '|'.
 * (Específico para o Painel de Status)
 * @param {string} name Nome bruto do cliente.
 * @returns {string} Nome formatado.
 */
function formatClientNameStatus(name) {
    return name ? name.replace(/\d+/g, '').split("|")[0].trim() : '';
}

/**
 * Gera as iniciais de um nome (máximo 2).
 * @param {string} name Nome completo.
 * @returns {string} Iniciais (ex: "JP") ou "??" se o nome for inválido.
 */
function getInitials(name) {
    if (!name || typeof name !== 'string') return '??';
    // Remove espaços extras e divide em palavras
    const words = name.trim().split(/\s+/);
    if (words.length === 0 || words[0] === '') return '??';

    // Pega a primeira letra da primeira palavra
    let initials = words[0][0];

    // Se houver mais de uma palavra, pega a primeira letra da última palavra
    if (words.length > 1) {
        initials += words[words.length - 1][0];
    }
    // Se for só uma palavra longa, pega as duas primeiras letras
    else if (words[0].length > 1) {
         initials += words[0][1];
    }

    return initials.toUpperCase();
}


console.log("Utils carregadas.");
