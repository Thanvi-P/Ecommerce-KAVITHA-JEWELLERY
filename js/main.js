// js/main.js
let currentCategory = 'all';
let currentSlide = 0;
let autoSlideInterval;
let slides, dots;

function renderProducts(category = 'all') {
    const productsGrid = document.getElementById('productsGrid');
    if(!productsGrid) return;
    const filtered = category === 'all' ? products : products.filter(p => p.category === category);
    productsGrid.innerHTML = '';
    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img class="product-img" src="${product.image}" alt="${product.title}" loading="lazy" onerror="this.src='https://placehold.co/600x800/f5e2d4/b85c3a?text=Jewelry'">
            <div class="product-info">
                <div class="product-title">${product.title}</div>
                <div class="product-price">₹${product.price.toLocaleString('en-IN')}</div>
                <div class="product-desc">${product.description.substring(0, 80)}...</div>
                <button class="add-to-cart" data-id="${product.id}"><i class="fas fa-shopping-cart"></i> Add to Cart</button>
            </div>
        `;
        card.addEventListener('click', (e) => {
            if(!e.target.classList.contains('add-to-cart') && !e.target.closest('.add-to-cart')) {
                showProductDetailPage(product);
            }
        });
        productsGrid.appendChild(card);
        const btn = card.querySelector('.add-to-cart');
        btn.addEventListener('click', (e) => { 
            e.stopPropagation(); 
            addToCart(product); 
        });
    });
}

function showProductDetailPage(product) {
    const homePage = document.getElementById('homePage');
    const productDetailPage = document.getElementById('productDetailPage');
    const footer = document.getElementById('footer');
    
    if(homePage) homePage.style.display = 'none';
    if(productDetailPage) productDetailPage.style.display = 'block';
    if(footer) footer.style.display = 'block';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const container = document.getElementById('productDetailContent');
    if(!container) return;
    
    container.innerHTML = `
        <div class="product-detail-wrapper">
            <div class="product-detail-image">
                <img src="${product.image}" alt="${product.title}" onerror="this.src='https://placehold.co/600x800/f5e2d4/b85c3a?text=Jewelry'">
            </div>
            <div class="product-detail-info">
                <h1>${product.title}</h1>
                <div class="product-detail-price">₹${product.price.toLocaleString('en-IN')}</div>
                <div class="product-detail-description">
                    <p>${product.description}</p>
                </div>
                <div class="product-specs">
                    <div class="spec-row"><div class="spec-label">Metal</div><div class="spec-value">${product.metal}</div></div>
                    <div class="spec-row"><div class="spec-label">Stone</div><div class="spec-value">${product.stone}</div></div>
                    <div class="spec-row"><div class="spec-label">Weight</div><div class="spec-value">${product.weight}</div></div>
                    <div class="spec-row"><div class="spec-label">Best For</div><div class="spec-value">${product.occasion}</div></div>
                    <div class="spec-row"><div class="spec-label">Care Instructions</div><div class="spec-value">${product.care}</div></div>
                </div>
                <button class="detail-add-button" id="detailAddBtn">
                    <i class="fas fa-shopping-cart"></i> Add to Cart - ₹${product.price.toLocaleString('en-IN')}
                </button>
            </div>
        </div>
    `;
    
    const detailBtn = document.getElementById('detailAddBtn');
    if(detailBtn) {
        detailBtn.addEventListener('click', () => { 
            addToCart(product); 
            showToast(`${product.title} added to cart!`);
        });
    }
}

function goBackToHome() {
    const homePage = document.getElementById('homePage');
    const productDetailPage = document.getElementById('productDetailPage');
    const footer = document.getElementById('footer');
    
    if(homePage) homePage.style.display = 'block';
    if(productDetailPage) productDetailPage.style.display = 'none';
    if(footer) footer.style.display = 'block';
    
    renderProducts(currentCategory);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initCategoryFilters() {
    const filters = document.querySelectorAll('.filter-btn');
    const collectionTitle = document.getElementById('collectionTitle');
    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            filters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            currentCategory = filter.dataset.category;
            renderProducts(currentCategory);
            const categoryNames = { 
                all: 'Our Signature Collection', 
                rings: 'Rings Collection', 
                pendants: 'Pendants Collection', 
                earrings: 'Earrings Collection' 
            };
            if(collectionTitle) {
                collectionTitle.textContent = categoryNames[currentCategory] || 'Our Collection';
            }
        });
    });
}

function initNavigation() {
    const navLinks = document.querySelectorAll('[data-nav]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.dataset.nav;
            if(target === 'home') {
                goBackToHome();
            } else if(target === 'collections') {
                goBackToHome();
                const productsGrid = document.getElementById('productsGrid');
                if(productsGrid) productsGrid.scrollIntoView({ behavior: 'smooth' });
            } else if(target === 'gold') {
                goBackToHome();
                const goldFilter = document.querySelector('.filter-btn[data-category="rings"]');
                if(goldFilter) goldFilter.click();
            }
        });
    });
}

function initSidebarControls() {
    const cartIcon = document.getElementById('cartIcon');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCartBtn = document.getElementById('closeCartBtn');
    
    if(cartIcon) {
        cartIcon.addEventListener('click', () => { 
            if(cartSidebar) cartSidebar.classList.add('open'); 
            if(cartOverlay) cartOverlay.classList.add('active'); 
            document.body.style.overflow = 'hidden'; 
        });
    }
    if(closeCartBtn) {
        closeCartBtn.addEventListener('click', () => { 
            if(cartSidebar) cartSidebar.classList.remove('open'); 
            if(cartOverlay) cartOverlay.classList.remove('active'); 
            document.body.style.overflow = ''; 
        });
    }
    if(cartOverlay) {
        cartOverlay.addEventListener('click', () => { 
            if(cartSidebar) cartSidebar.classList.remove('open'); 
            if(cartOverlay) cartOverlay.classList.remove('active'); 
            document.body.style.overflow = ''; 
        });
    }
}

function initCheckout() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    if(checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if(cart.length === 0) { showToast("Cart is empty!"); return; }
            const total = cart.reduce((sum, i) => sum + (i.product.price * i.quantity), 0);
            alert(`✨ Thank you for shopping! ✨\nTotal: ₹${total.toLocaleString('en-IN')}\nWe'll contact you shortly.`);
            cart = []; 
            saveCart(); 
            renderCartUI(); 
            updateCartCounter();
            const cartSidebar = document.getElementById('cartSidebar');
            const cartOverlay = document.getElementById('cartOverlay');
            if(cartSidebar) cartSidebar.classList.remove('open');
            if(cartOverlay) cartOverlay.classList.remove('active');
            showToast("Order placed! ❤️");
        });
    }
}

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast("✨ Message sent! We'll get back to you soon.");
            e.target.reset();
        });
    }
}

function initBackButton() {
    const backBtn = document.getElementById('backToHomeBtn');
    if(backBtn) backBtn.addEventListener('click', goBackToHome);
}

// ========== CAROUSEL FUNCTIONS ==========
function showSlide(index) {
    if(!slides || slides.length === 0) return;
    
    slides.forEach(slide => slide.classList.remove('active'));
    if(dots) dots.forEach(dot => dot.classList.remove('active'));
    
    if (index < 0) {
        currentSlide = slides.length - 1;
    } else if (index >= slides.length) {
        currentSlide = 0;
    } else {
        currentSlide = index;
    }
    
    if(slides[currentSlide]) slides[currentSlide].classList.add('active');
    if(dots && dots[currentSlide]) dots[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1);
    resetAutoSlide();
}

function prevSlide() {
    showSlide(currentSlide - 1);
    resetAutoSlide();
}

function startAutoSlide() {
    if(autoSlideInterval) clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => {
        nextSlide();
    }, 5000);
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

function initCarousel() {
    slides = document.querySelectorAll('.carousel-slide');
    dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    
    if(!slides.length) return;
    
    if(prevBtn) prevBtn.addEventListener('click', prevSlide);
    if(nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    if(dots.length) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                resetAutoSlide();
            });
        });
    }
    
    startAutoSlide();
    
    const carouselContainer = document.querySelector('.carousel-container');
    if(carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });
        
        carouselContainer.addEventListener('mouseleave', () => {
            startAutoSlide();
        });
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    initCategoryFilters();
    initNavigation();
    initSidebarControls();
    initCheckout();
    initContactForm();
    initAuth();
    initBackButton();
    loadCartFromStorage();
    initCarousel();
});