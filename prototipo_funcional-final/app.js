// ============ DADOS DA APLICAÇÃO ============
const app = {
    produtos: [
        { id: 1, nome: 'Hambúrguer de Boi', preco: 25.90, categoria: 'hamburguer', desc: 'Blend 180g, Cheddar, Bacon', emoji: '🍔' },
        { id: 2, nome: 'Hambúrguer de Frango', preco: 23.90, categoria: 'hamburguer', desc: 'Empanado crocante, Alface', emoji: '🍗' },
        { id: 3, nome: 'Hambúrguer de Peixe', preco: 24.90, categoria: 'hamburguer', desc: 'Filé empanado, Molho tártaro', emoji: '🐟' },
        { id: 4, nome: 'Batata Rústica', preco: 14.00, categoria: 'acompanhamento', desc: 'Batatas artesanais', emoji: '🍟' },
        { id: 5, nome: 'Batata Clássica', preco: 12.00, categoria: 'acompanhamento', desc: 'Fritas crocantes', emoji: '🍟' },
        { id: 6, nome: 'Refrigerante', preco: 6.00, categoria: 'bebida', desc: 'Lata 350ml', emoji: '🥤' },
        { id: 7, nome: 'Suco Natural', preco: 8.00, categoria: 'bebida', desc: 'Suco fresco', emoji: '🧃' },
    ],
    
    carrinho: [],
    pedidos: [],
    estoque: {
        1: 50, 2: 45, 3: 40, 4: 100, 5: 100, 6: 200, 7: 80
    },
    currentUser: null,
    proximoPedidoId: 1001,
    
    // Usuários pré-definidos (conforme instruções)
    usuarios: [
        { username: 'cliente', password: 'password_hash_123456', role: 'cliente', nome: 'Cliente' },
        { username: 'cozinha', password: 'password_hash_123456', role: 'cozinha', nome: 'Cozinheiro' },
        { username: 'Zé das couves', password: 'password_hash_123456', role: 'gerente', nome: 'Zé das Couves (Gerente)' }
    ]
};

// ============ INICIALIZAÇÃO ============
document.addEventListener('DOMContentLoaded', () => {
    checkSession();
    renderProducts();
    updateCartCount();
});

// ============ SISTEMA DE AUTENTICAÇÃO ============

function hashPassword(password) {
    return 'password_hash_' + password;
}

function login() {
    const userInp = document.getElementById('username').value;
    const passInp = document.getElementById('password').value;
    const errorDiv = document.getElementById('login-error');
    
    errorDiv.innerText = '';
    
    const user = app.usuarios.find(u => u.username === userInp && u.password === hashPassword(passInp));
    
    if (user) {
        app.currentUser = user;
        localStorage.setItem('iron_burguer_session', JSON.stringify(user));
        showAuthenticatedUI();
    } else {
        errorDiv.innerText = 'Usuário ou senha incorretos.';
    }
}

function logout() {
    app.currentUser = null;
    localStorage.removeItem('iron_burguer_session');
    location.reload();
}

function checkSession() {
    const session = localStorage.getItem('iron_burguer_session');
    if (session) {
        app.currentUser = JSON.parse(session);
        showAuthenticatedUI();
    } else {
        showLoginUI();
    }
}

function showLoginUI() {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('login-view').classList.add('active');
    document.getElementById('user-info-display').style.display = 'none';
}

function showAuthenticatedUI() {
    document.getElementById('login-view').classList.remove('active');
    document.getElementById('user-info-display').style.display = 'flex';
    document.getElementById('logged-user-name').innerText = app.currentUser.nome;
    
    if (app.currentUser.role === 'cliente') {
        switchView('cliente-view');
    } else if (app.currentUser.role === 'cozinha') {
        switchView('cozinha-view');
        updateKitchenView();
    } else if (app.currentUser.role === 'gerente') {
        switchView('gestor-view');
        updateDashboard();
    }
}

function switchView(viewId) {
    if (!app.currentUser) {
        showLoginUI();
        return;
    }
    
    const role = app.currentUser.role;
    
    if (viewId === 'cozinha-view' && role === 'cliente') {
        alert('Acesso negado!');
        switchView('cliente-view');
        return;
    }
    
    if (viewId === 'gestor-view' && role !== 'gerente') {
        alert('Acesso negado! Somente o Gerente pode acessar esta área.');
        const defaultView = role === 'cliente' ? 'cliente-view' : 'cozinha-view';
        switchView(defaultView);
        return;
    }

    if (viewId === 'cliente-view' && role === 'cozinha') {
        alert('Acesso negado!');
        switchView('cozinha-view');
        return;
    }

    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
}

// ============ FUNCIONALIDADES DO CLIENTE ============

function renderProducts(categoria = 'hamburguer') {
    const container = document.getElementById('products-list');
    if (!container) return;
    container.innerHTML = '';

    const produtosFiltrados = app.produtos.filter(p => p.categoria === categoria);

    produtosFiltrados.forEach(produto => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-img">${produto.emoji}</div>
            <div class="product-info">
                <div class="product-name">${produto.nome}</div>
                <div class="product-desc">${produto.desc}</div>
                <div class="product-footer">
                    <span class="product-price">R$ ${produto.preco.toFixed(2).replace('.', ',')}</span>
                    <button class="add-btn" onclick="addToCart(${produto.id})">Adicionar</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function filterCategory(categoria) {
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderProducts(categoria);
}

function addToCart(produtoId) {
    const produto = app.produtos.find(p => p.id === produtoId);
    
    if (app.estoque[produtoId] <= 0) {
        alert('Produto fora de estoque!');
        return;
    }

    const itemExistente = app.carrinho.find(item => item.id === produtoId);
    
    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        app.carrinho.push({
            id: produtoId,
            nome: produto.nome,
            preco: produto.preco,
            quantidade: 1
        });
    }

    updateCartCount();
    updateCartModal();
    
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = '✓';
    btn.style.background = '#2e7d32';
    setTimeout(() => {
        btn.innerText = originalText;
        btn.style.background = '';
    }, 800);
}

function updateCartCount() {
    const el = document.getElementById('cart-count');
    if (!el) return;
    const totalItens = app.carrinho.reduce((sum, item) => sum + item.quantidade, 0);
    el.innerText = totalItens;
}

function toggleCartModal() {
    const modal = document.getElementById('cart-modal');
    modal.classList.toggle('active');
    updateCartModal();
}

function updateCartModal() {
    const cartItems = document.getElementById('cart-items');
    if (!cartItems) return;
    cartItems.innerHTML = '';

    if (app.carrinho.length === 0) {
        cartItems.innerHTML = '<p style="text-align:center; color:#666; padding:20px;">Carrinho vazio</p>';
    } else {
        app.carrinho.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.nome}</div>
                    <div class="cart-item-details">Qtd: ${item.quantidade}</div>
                </div>
                <div style="text-align: right;">
                    <div class="cart-item-price">R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</div>
                    <button class="remove-btn" onclick="removeFromCart(${index})">Remover</button>
                </div>
            `;
            cartItems.appendChild(itemDiv);
        });
    }

    updateCartSummary();
}

function removeFromCart(index) {
    app.carrinho.splice(index, 1);
    updateCartCount();
    updateCartModal();
}

function updateCartSummary() {
    const subtotal = app.carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    const taxa = subtotal * 0.05;
    const total = subtotal + taxa;

    const subEl = document.getElementById('subtotal');
    const taxaEl = document.getElementById('taxa');
    const totalEl = document.getElementById('total');
    
    if (subEl) subEl.innerText = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    if (taxaEl) taxaEl.innerText = `R$ ${taxa.toFixed(2).replace('.', ',')}`;
    if (totalEl) totalEl.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function finalizarPedido() {
    if (app.carrinho.length === 0) {
        alert('Carrinho vazio!');
        return;
    }
    
    document.getElementById('cart-modal').classList.remove('active');
    togglePaymentModal();
}

// ============ ÁREA DE PAGAMENTO ============

function togglePaymentModal() {
    const modal = document.getElementById('payment-modal');
    const isActive = modal.classList.toggle('active');
    
    if (isActive) {
        renderPaymentSummary();
    }
}

function renderPaymentSummary() {
    const list = document.getElementById('payment-items-list');
    list.innerHTML = '';
    
    app.carrinho.forEach(item => {
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.justifyContent = 'space-between';
        div.innerHTML = `<span>${item.quantidade}x ${item.nome}</span> <span>R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</span>`;
        list.appendChild(div);
    });
    
    const subtotal = app.carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    const taxa = subtotal * 0.05;
    const total = subtotal + taxa;
    
    document.getElementById('payment-total-value').innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function toggleCardFields() {
    const method = document.getElementById('payment-method').value;
    const fields = document.getElementById('card-fields');
    fields.style.display = method === 'cartao' ? 'block' : 'none';
}

function processarPagamento() {
    const method = document.getElementById('payment-method').value;
    const errorDiv = document.getElementById('payment-error');
    errorDiv.innerText = '';
    
    if (method === 'cartao') {
        const num = document.getElementById('card-number').value;
        const exp = document.getElementById('card-expiry').value;
        const cvv = document.getElementById('card-cvv').value;
        
        if (!num || !exp || !cvv) {
            errorDiv.innerText = 'Por favor, preencha todos os dados do cartão.';
            return;
        }
    }
    
    // Simular processamento
    const btn = event.target;
    btn.disabled = true;
    btn.innerText = 'Processando...';
    
    setTimeout(() => {
        processarPedidoFinal();
        btn.disabled = false;
        btn.innerText = 'Confirmar e Pagar';
        togglePaymentModal();
    }, 1500);
}

function processarPedidoFinal() {
    const subtotal = app.carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    const taxa = subtotal * 0.05;
    const total = subtotal + taxa;

    const pedido = {
        id: app.proximoPedidoId++,
        itens: [...app.carrinho],
        total: total,
        status: 'recebido',
        timestamp: new Date(),
        tempo: 0
    };

    app.carrinho.forEach(item => {
        app.estoque[item.id] -= item.quantidade;
    });

    app.pedidos.push(pedido);

    document.getElementById('order-number').innerText = `Número do Pedido: #${pedido.id}`;
    document.getElementById('order-total').innerText = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
    
    document.getElementById('confirmation-modal').classList.add('active');

    app.carrinho = [];
    updateCartCount();
    updateCartModal();
    
    updateKitchenView();
    updateDashboard();
}

function closeConfirmation() {
    document.getElementById('confirmation-modal').classList.remove('active');
}

// ============ FUNCIONALIDADES DA COZINHA ============

function updateKitchenView() {
    const queue = document.getElementById('kitchen-queue');
    if (!queue) return;
    queue.innerHTML = '';

    const pedidosAtivos = app.pedidos.filter(p => p.status !== 'entregue');

    const totEl = document.getElementById('pedidos-total');
    const prepEl = document.getElementById('pedidos-preparo');
    const prontoEl = document.getElementById('pedidos-prontos');

    if (totEl) totEl.innerText = pedidosAtivos.length;
    if (prepEl) prepEl.innerText = pedidosAtivos.filter(p => p.status === 'preparando').length;
    if (prontoEl) prontoEl.innerText = pedidosAtivos.filter(p => p.status === 'pronto').length;

    if (pedidosAtivos.length === 0) {
        queue.innerHTML = '<p style="text-align:center; color:#666; padding:20px;">Nenhum pedido pendente</p>';
        return;
    }

    pedidosAtivos.forEach(pedido => {
        const card = document.createElement('div');
        card.className = 'order-card';
        card.style.borderLeftColor = pedido.status === 'pronto' ? '#2e7d32' : '#ff4500';
        
        let itensHtml = '';
        pedido.itens.forEach(item => {
            itensHtml += `<div class="order-item">• ${item.quantidade}x ${item.nome}</div>`;
        });

        card.innerHTML = `
            <div class="order-number">#${pedido.id}</div>
            <div class="order-items">${itensHtml}</div>
            <div class="order-time">Tempo: ${Math.floor((new Date() - pedido.timestamp) / 1000)}s</div>
            <div class="order-status">
                ${pedido.status === 'recebido' ? `
                    <button class="status-btn start" onclick="iniciarPreparo(${pedido.id})">Iniciar Preparo</button>
                ` : ''}
                ${pedido.status === 'preparando' ? `
                    <button class="status-btn ready" onclick="marcarPronto(${pedido.id})">Marcar como Pronto</button>
                ` : ''}
                ${pedido.status === 'pronto' ? `
                    <button class="status-btn ready" onclick="marcarEntregue(${pedido.id})">Confirmar Entrega</button>
                ` : ''}
            </div>
        `;
        queue.appendChild(card);
    });

    if (document.getElementById('cozinha-view').classList.contains('active')) {
        setTimeout(updateKitchenView, 1000);
    }
}

function iniciarPreparo(pedidoId) {
    const pedido = app.pedidos.find(p => p.id === pedidoId);
    if (pedido) {
        pedido.status = 'preparando';
        updateKitchenView();
    }
}

function marcarPronto(pedidoId) {
    const pedido = app.pedidos.find(p => p.id === pedidoId);
    if (pedido) {
        pedido.status = 'pronto';
        updateKitchenView();
    }
}

function marcarEntregue(pedidoId) {
    const pedido = app.pedidos.find(p => p.id === pedidoId);
    if (pedido) {
        pedido.status = 'entregue';
        updateKitchenView();
    }
}

// ============ FUNCIONALIDADES DO GESTOR ============

function updateDashboard() {
    const fatEl = document.getElementById('faturamento-total');
    if (!fatEl) return;

    const faturamento = app.pedidos
        .filter(p => p.status === 'entregue')
        .reduce((sum, p) => sum + p.total, 0);

    fatEl.innerText = `R$ ${faturamento.toFixed(2).replace('.', ',')}`;
    document.getElementById('total-pedidos-gestor').innerText = app.pedidos.filter(p => p.status === 'entregue').length;

    const estoqueCritico = document.getElementById('estoque-critico');
    estoqueCritico.innerHTML = '';
    
    let temCritico = false;
    app.produtos.forEach(produto => {
        if (app.estoque[produto.id] < 20) {
            temCritico = true;
            const item = document.createElement('div');
            item.className = 'estoque-item';
            item.innerText = `${produto.nome}: ${app.estoque[produto.id]} un`;
            estoqueCritico.appendChild(item);
        }
    });

    if (!temCritico) {
        estoqueCritico.innerHTML = '<div style="color: #2e7d32;">✓ Estoque normal</div>';
    }

    renderSalesChart();
    renderEstoqueManager();
}

function renderSalesChart() {
    const chart = document.getElementById('sales-chart');
    if (!chart) return;
    chart.innerHTML = '';

    const vendas = {};
    app.produtos.forEach(p => vendas[p.id] = 0);

    app.pedidos.forEach(pedido => {
        pedido.itens.forEach(item => {
            vendas[item.id] = (vendas[item.id] || 0) + item.quantidade;
        });
    });

    const maxVendas = Math.max(...Object.values(vendas), 1);

    app.produtos.forEach(produto => {
        const vendido = vendas[produto.id] || 0;
        const altura = (vendido / maxVendas) * 150;

        const barDiv = document.createElement('div');
        barDiv.className = 'chart-bar';
        barDiv.innerHTML = `
            <div class="bar" style="height: ${altura}px;">${vendido}</div>
            <div class="bar-label">${produto.nome.split(' ')[0]}</div>
        `;
        chart.appendChild(barDiv);
    });
}

function renderEstoqueManager() {
    const manager = document.getElementById('estoque-manager');
    if (!manager) return;
    manager.innerHTML = '';

    app.produtos.forEach(produto => {
        const item = document.createElement('div');
        item.className = 'estoque-item-manager';
        item.innerHTML = `
            <div class="estoque-item-name">${produto.nome}</div>
            <div style="color: var(--text-secondary); margin-bottom: 10px;">Atual: ${app.estoque[produto.id]} un</div>
            <input type="number" class="estoque-input" id="estoque-${produto.id}" placeholder="Quantidade" min="0">
            <button class="estoque-btn" onclick="atualizarEstoque(${produto.id})">Atualizar</button>
        `;
        manager.appendChild(item);
    });
}

function atualizarEstoque(produtoId) {
    const input = document.getElementById(`estoque-${produtoId}`);
    const novaQuantidade = parseInt(input.value);

    if (isNaN(novaQuantidade) || novaQuantidade < 0) {
        alert('Quantidade inválida!');
        return;
    }

    app.estoque[produtoId] = novaQuantidade;
    input.value = '';
    updateDashboard();
    alert('Estoque atualizado!');
}
