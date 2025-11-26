// Categorias por tipo de transação
const categorias = {
    receita: ['Salário', 'Freelance', 'Venda', 'Bônus', 'Investimento', 'Outro'],
    despesa: ['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Educação', 'Lazer', 'Compras', 'Contas', 'Outro']
};

// Estado da aplicação
let transacoes = [];
let mesSelecionado = new Date();

// Inicializar aplicação
document.addEventListener('DOMContentLoaded', () => {
    carregarTransacoes();
    configurarEventos();
    atualizarDashboard();
    atualizarMesSelecionado();
    preencherDataAtual();
});

// Carregar transações do localStorage
function carregarTransacoes() {
    const dados = localStorage.getItem('minhasFinancas');
    transacoes = dados ? JSON.parse(dados) : [];
}

// Salvar transações no localStorage
function salvarTransacoes() {
    localStorage.setItem('minhasFinancas', JSON.stringify(transacoes));
}

// Configurar eventos
function configurarEventos() {
    // Navegação entre abas
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            mudarAba(e.target.dataset.tab);
        });
    });

    // Formulário de transação
    document.getElementById('formularioTransacao').addEventListener('submit', adicionarTransacao);
    document.getElementById('tipo').addEventListener('change', atualizarCategorias);

    // Filtros de histórico
    document.getElementById('filtroMes').addEventListener('change', filtrarTransacoes);
    document.getElementById('filtroTipo').addEventListener('change', filtrarTransacoes);
    document.getElementById('btnLimparFiltros').addEventListener('click', limparFiltros);

    // Navegação de meses
    document.getElementById('mesAnterior').addEventListener('click', () => {
        mesSelecionado.setMonth(mesSelecionado.getMonth() - 1);
        atualizarMesSelecionado();
    });

    document.getElementById('mesProximo').addEventListener('click', () => {
        mesSelecionado.setMonth(mesSelecionado.getMonth() + 1);
        atualizarMesSelecionado();
    });

    // Relatório
    document.getElementById('relatorioMes').addEventListener('change', gerarRelatorio);
}

// Mudar de aba
function mudarAba(nomeAba) {
    // Remover classe active de todas as abas
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Adicionar classe active à aba selecionada
    document.getElementById(nomeAba).classList.add('active');
    document.querySelector(`[data-tab="${nomeAba}"]`).classList.add('active');

    // Atualizar conteúdo específico da aba
    if (nomeAba === 'historico') {
        filtrarTransacoes();
    } else if (nomeAba === 'relatorio') {
        const hoje = new Date();
        const mesAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;
        document.getElementById('relatorioMes').value = mesAtual;
        gerarRelatorio();
    }
}

// Atualizar categorias conforme tipo selecionado
function atualizarCategorias() {
    const tipo = document.getElementById('tipo').value;
    const selectCategoria = document.getElementById('categoria');
    selectCategoria.innerHTML = '<option value="">Selecione...</option>';

    if (tipo && categorias[tipo]) {
        categorias[tipo].forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            selectCategoria.appendChild(option);
        });
    }
}

// Preencher data atual no formulário
function preencherDataAtual() {
    const hoje = new Date();
    const dataFormatada = hoje.toISOString().split('T')[0];
    document.getElementById('data').value = dataFormatada;
}

// Adicionar nova transação
function adicionarTransacao(e) {
    e.preventDefault();

    const tipo = document.getElementById('tipo').value;
    const categoria = document.getElementById('categoria').value;
    const descricao = document.getElementById('descricao').value;
    const valor = parseFloat(document.getElementById('valor').value);
    const data = document.getElementById('data').value;

    if (!tipo || !categoria || !descricao || !valor || !data) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    const novaTransacao = {
        id: Date.now(),
        tipo,
        categoria,
        descricao,
        valor,
        data,
        dataCriacao: new Date().toISOString()
    };

    transacoes.push(novaTransacao);
    salvarTransacoes();

    // Limpar formulário
    document.getElementById('formularioTransacao').reset();
    preencherDataAtual();
    document.getElementById('categoria').innerHTML = '<option value="">Selecione...</option>';

    alert('Transação adicionada com sucesso!');
    atualizarDashboard();
}

// Deletar transação
function deletarTransacao(id) {
    if (confirm('Tem certeza que deseja deletar esta transação?')) {
        transacoes = transacoes.filter(t => t.id !== id);
        salvarTransacoes();
        atualizarDashboard();
        filtrarTransacoes();
    }
}

// Atualizar dashboard
function atualizarDashboard() {
    const mesAtual = mesSelecionado.getMonth();
    const anoAtual = mesSelecionado.getFullYear();

    const transacoesMes = transacoes.filter(t => {
        const dataTrans = new Date(t.data);
        return dataTrans.getMonth() === mesAtual && dataTrans.getFullYear() === anoAtual;
    });

    const totalReceita = transacoesMes
        .filter(t => t.tipo === 'receita')
        .reduce((sum, t) => sum + t.valor, 0);

    const totalDespesa = transacoesMes
        .filter(t => t.tipo === 'despesa')
        .reduce((sum, t) => sum + t.valor, 0);

    const economia = totalReceita - totalDespesa;

    // Atualizar cards
    document.getElementById('totalReceita').textContent = formatarMoeda(totalReceita);
    document.getElementById('totalDespesa').textContent = formatarMoeda(totalDespesa);
    document.getElementById('totalEconomia').textContent = formatarMoeda(economia);

    // Atualizar resumo detalhado
    atualizarResumoDetalhado(transacoesMes);
}

// Atualizar resumo detalhado por categoria
function atualizarResumoDetalhado(transacoesMes) {
    const resumo = {};

    transacoesMes.forEach(t => {
        const chave = `${t.tipo}-${t.categoria}`;
        if (!resumo[chave]) {
            resumo[chave] = {
                tipo: t.tipo,
                categoria: t.categoria,
                valor: 0
            };
        }
        resumo[chave].valor += t.valor;
    });

    const container = document.getElementById('resumoDetalhado');
    container.innerHTML = '';

    if (Object.keys(resumo).length === 0) {
        container.innerHTML = '<p class="vazio"><p>Nenhuma transação neste mês</p></p>';
        return;
    }

    Object.values(resumo).forEach(item => {
        const div = document.createElement('div');
        div.className = `resumo-item ${item.tipo}`;
        div.innerHTML = `
            <div class="resumo-item-label">${item.categoria}</div>
            <div class="resumo-item-valor">${formatarMoeda(item.valor)}</div>
        `;
        container.appendChild(div);
    });
}

// Atualizar mês selecionado
function atualizarMesSelecionado() {
    const opcoes = { year: 'numeric', month: 'long' };
    const mesFormatado = mesSelecionado.toLocaleDateString('pt-BR', opcoes);
    document.getElementById('mesSelecionado').textContent = mesFormatado;
    atualizarDashboard();
}

// Filtrar transações no histórico
function filtrarTransacoes() {
    const filtroMes = document.getElementById('filtroMes').value;
    const filtroTipo = document.getElementById('filtroTipo').value;

    let transacoesFiltradas = transacoes;

    if (filtroMes) {
        transacoesFiltradas = transacoesFiltradas.filter(t => {
            const dataTrans = t.data.substring(0, 7);
            return dataTrans === filtroMes;
        });
    }

    if (filtroTipo) {
        transacoesFiltradas = transacoesFiltradas.filter(t => t.tipo === filtroTipo);
    }

    // Ordenar por data (mais recente primeiro)
    transacoesFiltradas.sort((a, b) => new Date(b.data) - new Date(a.data));

    exibirTransacoes(transacoesFiltradas);
}

// Exibir transações na lista
function exibirTransacoes(lista) {
    const container = document.getElementById('listaTransacoes');
    container.innerHTML = '';

    if (lista.length === 0) {
        container.innerHTML = '<div class="vazio"><p>Nenhuma transação encontrada</p></div>';
        return;
    }

    lista.forEach(t => {
        const dataFormatada = new Date(t.data).toLocaleDateString('pt-BR');
        const div = document.createElement('div');
        div.className = `transacao-item ${t.tipo}`;
        div.innerHTML = `
            <div class="transacao-info">
                <div class="transacao-descricao">${t.descricao}</div>
                <div class="transacao-meta">${t.categoria} • ${dataFormatada}</div>
            </div>
            <div class="transacao-valor">${t.tipo === 'receita' ? '+' : '-'} ${formatarMoeda(t.valor)}</div>
            <button class="btn-deletar" onclick="deletarTransacao(${t.id})">Deletar</button>
        `;
        container.appendChild(div);
    });
}

// Limpar filtros
function limparFiltros() {
    document.getElementById('filtroMes').value = '';
    document.getElementById('filtroTipo').value = '';
    filtrarTransacoes();
}

// Gerar relatório mensal
function gerarRelatorio() {
    const mesRelatorio = document.getElementById('relatorioMes').value;

    if (!mesRelatorio) {
        document.getElementById('conteudoRelatorio').innerHTML = '<p class="vazio"><p>Selecione um mês</p></p>';
        return;
    }

    const [ano, mes] = mesRelatorio.split('-');
    const transacoesMes = transacoes.filter(t => {
        return t.data.substring(0, 7) === mesRelatorio;
    });

    if (transacoesMes.length === 0) {
        document.getElementById('conteudoRelatorio').innerHTML = '<p class="vazio"><p>Nenhuma transação neste mês</p></p>';
        return;
    }

    // Calcular totais
    const receitas = transacoesMes.filter(t => t.tipo === 'receita');
    const despesas = transacoesMes.filter(t => t.tipo === 'despesa');

    const totalReceita = receitas.reduce((sum, t) => sum + t.valor, 0);
    const totalDespesa = despesas.reduce((sum, t) => sum + t.valor, 0);
    const economia = totalReceita - totalDespesa;

    // Agrupar por categoria
    const receitasPorCategoria = agruparPorCategoria(receitas);
    const despesasPorCategoria = agruparPorCategoria(despesas);

    let html = '';

    // Seção de Receitas
    if (receitas.length > 0) {
        html += '<div class="relatorio-secao">';
        html += '<h3>📈 Receitas</h3>';
        Object.entries(receitasPorCategoria).forEach(([categoria, valor]) => {
            html += `
                <div class="relatorio-linha">
                    <span class="relatorio-label">${categoria}</span>
                    <span class="relatorio-valor" style="color: var(--cor-receita);">+ ${formatarMoeda(valor)}</span>
                </div>
            `;
        });
        html += `
            <div class="relatorio-linha" style="border-top: 2px solid var(--cor-receita); margin-top: 10px; padding-top: 10px;">
                <span class="relatorio-label"><strong>Total Receita</strong></span>
                <span class="relatorio-valor" style="color: var(--cor-receita);"><strong>${formatarMoeda(totalReceita)}</strong></span>
            </div>
        `;
        html += '</div>';
    }

    // Seção de Despesas
    if (despesas.length > 0) {
        html += '<div class="relatorio-secao">';
        html += '<h3>📉 Despesas</h3>';
        Object.entries(despesasPorCategoria).forEach(([categoria, valor]) => {
            html += `
                <div class="relatorio-linha">
                    <span class="relatorio-label">${categoria}</span>
                    <span class="relatorio-valor" style="color: var(--cor-despesa);">- ${formatarMoeda(valor)}</span>
                </div>
            `;
        });
        html += `
            <div class="relatorio-linha" style="border-top: 2px solid var(--cor-despesa); margin-top: 10px; padding-top: 10px;">
                <span class="relatorio-label"><strong>Total Despesa</strong></span>
                <span class="relatorio-valor" style="color: var(--cor-despesa);"><strong>${formatarMoeda(totalDespesa)}</strong></span>
            </div>
        `;
        html += '</div>';
    }

    // Resumo final
    const corEconomia = economia >= 0 ? 'var(--cor-receita)' : 'var(--cor-despesa)';
    html += `
        <div class="relatorio-total" style="background: linear-gradient(135deg, var(--cor-primaria) 0%, #1e40af 100%);">
            <h4>💰 Resultado Final</h4>
            <div class="valor" style="color: ${corEconomia};">${economia >= 0 ? '+' : ''} ${formatarMoeda(economia)}</div>
        </div>
    `;

    document.getElementById('conteudoRelatorio').innerHTML = html;
}

// Agrupar transações por categoria
function agruparPorCategoria(lista) {
    const agrupado = {};
    lista.forEach(t => {
        if (!agrupado[t.categoria]) {
            agrupado[t.categoria] = 0;
        }
        agrupado[t.categoria] += t.valor;
    });
    return agrupado;
}

// Formatar valor em moeda brasileira
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}
