/* ===== PRODUCT DATA ===== */
const products = [
    { id: 1, name: 'Wireless Headphones', price: 79.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', rating: 4.5, category: 'electronics' },
    { id: 2, name: 'Smart Watch Pro', price: 199.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', rating: 4.7, category: 'watches' },
    { id: 3, name: 'Casual Sneakers', price: 89.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', rating: 4.3, category: 'shoes' },
    { id: 4, name: 'Designer Handbag', price: 149.99, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop', rating: 4.6, category: 'fashion' },
    { id: 5, name: 'Bluetooth Speaker', price: 54.99, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop', rating: 4.4, category: 'electronics' },
    { id: 6, name: 'Skincare Set', price: 44.99, image: 'https://images.unsplash.com/photo-1570194065650-d99fb4a8e9b3?w=400&h=400&fit=crop', rating: 4.8, category: 'beauty' },
    { id: 7, name: 'Analog Watch', price: 129.99, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop', rating: 4.2, category: 'watches' },
    { id: 8, name: 'Air Purifier', price: 249.99, image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop', rating: 4.5, category: 'appliances' }
];

/* ===== CART STATE ===== */
let cartCount = 0;
const cartBadge = document.getElementById('cart-badge');

/* ===== RENDER PRODUCTS ===== */
function renderProducts(filterCategory = null) {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    let filtered = products;
    if (filterCategory) {
        filtered = products.filter(p => p.category === filterCategory);
    }

    if (filtered.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-light); padding: 40px;">No products found in this category.</p>`;
        return;
    }

    grid.innerHTML = filtered.map(product => {
        const stars = renderStars(product.rating);
        return `
            <div class="product-card" data-id="${product.id}">
                <div class="product-card__image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="product-card__body">
                    <h3 class="product-card__name">${product.name}</h3>
                    <p class="product-card__price">$${product.price.toFixed(2)}</p>
                    <div class="product-card__rating">
                        ${stars} <span>(${product.rating})</span>
                    </div>
                    <button class="product-card__btn" onclick="addToCart(this, ${product.id})">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

/* ===== RENDER STAR RATINGS ===== */
function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

/* ===== ADD TO CART ===== */
function addToCart(btn, productId) {
    cartCount++;
    cartBadge.textContent = cartCount;
    cartBadge.style.animation = 'none';
    setTimeout(() => cartBadge.style.animation = 'pulse 0.3s ease');

    btn.classList.add('in-cart');
    btn.innerHTML = '<i class="fas fa-check"></i> Added';
    btn.disabled = true;

    setTimeout(() => {
        btn.classList.remove('in-cart');
        btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
        btn.disabled = false;
    }, 1500);
}

/* ===== MOBILE MENU TOGGLE ===== */
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('show');
});

/* Close mobile menu on link click */
document.querySelectorAll('.header__nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show');
    });
});

/* ===== ACTIVE NAV LINK ON SCROLL ===== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.header__nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const top = section.offsetTop - 150;
        if (window.scrollY >= top) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

/* ===== BACK TO TOP BUTTON ===== */
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ===== SEARCH FUNCTIONALITY ===== */
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const searchResults = document.getElementById('search-results');

function performSearch(query) {
    query = query.toLowerCase().trim();

    if (query.length === 0) {
        searchResults.classList.remove('active');
        return;
    }

    const results = products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );

    if (results.length === 0) {
        searchResults.innerHTML = `<p style="text-align: center; color: var(--text-light); padding: 20px;">No products found for "${query}"</p>`;
    } else {
        searchResults.innerHTML = results.map(p => `
            <div class="search-item" onclick="selectSearchResult(${p.id})">
                <img src="${p.image}" alt="${p.name}">
                <div class="search-item__info">
                    <h4>${p.name}</h4>
                    <span>$${p.price.toFixed(2)}</span>
                </div>
            </div>
        `).join('');
    }
    searchResults.classList.add('active');
}

function selectSearchResult(id) {
    searchInput.value = '';
    searchResults.classList.remove('active');
    document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });

    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        card.style.border = 'none';
        if (parseInt(card.dataset.id) === id) {
            card.style.border = '2px solid var(--primary)';
            card.style.boxShadow = 'var(--shadow-hover)';
            setTimeout(() => {
                card.style.border = 'none';
                card.style.boxShadow = '';
            }, 3000);
        }
    });
}

searchInput.addEventListener('input', (e) => performSearch(e.target.value));
searchBtn.addEventListener('click', () => performSearch(searchInput.value));

/* Close search on Escape */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        searchResults.classList.remove('active');
        navMenu.classList.remove('show');
    }
});

/* Close search on outside click */
document.addEventListener('click', (e) => {
    if (!e.target.closest('.header__search') && !e.target.closest('#search-results')) {
        searchResults.classList.remove('active');
    }
});

/* ===== CATEGORY FILTERING ===== */
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
        const category = card.dataset.category;
        renderProducts(category);
        document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
    });
});

/* ===== NEWSLETTER FORM ===== */
document.getElementById('newsletter-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input').value;
    if (email) {
        alert('Thank you for subscribing! You will receive our latest updates at ' + email);
        e.target.reset();
    }
});

/* ===== INITIALIZE ===== */
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
});

/* ===== CART ICON CLICK FEEDBACK ===== */
document.getElementById('cart-icon').addEventListener('click', () => {
    if (cartCount === 0) {
        alert('Your cart is empty. Add some products to get started!');
    } else {
        alert(`You have ${cartCount} item(s) in your cart.`);
    }
});
