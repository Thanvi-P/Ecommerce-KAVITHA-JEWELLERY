// js/cart.js
let cart = [];

function saveCart() { localStorage.setItem('kavita_cart', JSON.stringify(cart)); }

function loadCartFromStorage() {
    const saved = localStorage.getItem('kavita_cart');
    if(saved) {
        try {
            let parsed = JSON.parse(saved);
            cart = parsed.map(item => {
                const prod = products.find(p => p.id === item.id);
                if(prod) return { ...item, product: prod };
                return null;
            }).filter(v => v !== null);
            renderCartUI();
            updateCartCounter();
        } catch(e) {}
    }
}

function addToCart(product) {
    const existing = cart.findIndex(item => item.id === product.id);
    if(existing !== -1) cart[existing].quantity += 1;
    else cart.push({ id: product.id, quantity: 1, product: product });
    saveCart();
    renderCartUI();
    updateCartCounter();
    showToast(`${product.title} added to bag ✨`);
}

function removeCartItem(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCartUI();
    updateCartCounter();
    showToast("Item removed");
}

function updateQuantity(productId, delta) {
    const idx = cart.findIndex(item => item.id === productId);
    if(idx !== -1) {
        const newQty = cart[idx].quantity + delta;
        if(newQty <= 0) removeCartItem(productId);
        else { cart[idx].quantity = newQty; saveCart(); renderCartUI(); updateCartCounter(); }
    }
}

function updateCartCounter() {
    const totalQty = cart.reduce((sum, i) => sum + i.quantity, 0);
    const cartCount = document.getElementById('cartCount');
    if(cartCount) cartCount.textContent = totalQty;
}

function renderCartUI() {
    const cartItemsList = document.getElementById('cartItemsList');
    const cartFooter = document.getElementById('cartFooter');
    const cartTotalAmountSpan = document.getElementById('cartTotalAmount');
    if(!cartItemsList) return;
    if(cart.length === 0) {
        cartItemsList.innerHTML = `<div class="empty-cart-msg">Your jewellery box is empty ✨</div>`;
        if(cartFooter) cartFooter.style.display = 'none';
        return;
    }
    if(cartFooter) cartFooter.style.display = 'block';
    let total = 0, html = '';
    for(let item of cart) {
        const prod = item.product;
        const itemTotal = prod.price * item.quantity;
        total += itemTotal;
        html += `<div class="cart-item"><img class="cart-item-img" src="${prod.image}"><div class="cart-item-details"><div class="cart-item-title">${prod.title}</div><div class="cart-item-price">₹${prod.price.toLocaleString('en-IN')}</div><div class="cart-item-qty"><button class="qty-btn" data-action="dec" data-id="${prod.id}">−</button><span>${item.quantity}</span><button class="qty-btn" data-action="inc" data-id="${prod.id}">+</button><button class="remove-item" data-action="remove" data-id="${prod.id}"><i class="fas fa-trash-alt"></i></button></div></div><div>₹${itemTotal.toLocaleString('en-IN')}</div></div>`;
    }
    cartItemsList.innerHTML = html;
    if(cartTotalAmountSpan) cartTotalAmountSpan.textContent = `₹${total.toLocaleString('en-IN')}`;
    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            if(btn.dataset.action === 'inc') updateQuantity(id, 1);
            if(btn.dataset.action === 'dec') updateQuantity(id, -1);
        });
    });
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            removeCartItem(id);
        });
    });
}

function showToast(msg) {
    const toast = document.getElementById('toastMsg');
    if(toast) {
        toast.textContent = msg;
        toast.classList.add('show');
        if(window.toastTimeout) clearTimeout(window.toastTimeout);
        window.toastTimeout = setTimeout(() => toast.classList.remove('show'), 2000);
    }
}