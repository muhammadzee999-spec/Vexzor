let cart = JSON.parse(localStorage.getItem('vexzor_cart')) || [];

function addToCart(productId) {
    let product = null;

    // ALWAYS try DOM card FIRST — the hardcoded HTML is the source of truth
    const card = document.querySelector(`.shop-product-card[data-id="${productId}"]`);
    if (card) {
        const name = card.querySelector('.spc-name')?.textContent || 'VEXZOR Product';
        const priceText = card.querySelector('.spc-price')?.textContent || '$0';
        const price = parseFloat(priceText.replace('$', ''));
        const image = card.querySelector('.spc-image img')?.getAttribute('src') || '';
        const category = card.getAttribute('data-category') || '';
        const subcategory = card.getAttribute('data-subcategory') || '';
        const imagesStr = card.getAttribute('data-images') || '';
        const images = imagesStr ? imagesStr.split(',').map(s => s.trim()) : [image];

        product = {
            id: parseInt(productId),
            name: name,
            price: price,
            image: image,
            images: images,
            category: category,
            subcategory: subcategory
        };
    }

    // Fallback: if no DOM card found (e.g. on home page), try products.js array
    if (!product) {
        const fromArray = products.find(p => p.id === parseInt(productId));
        if (fromArray) {
            product = {
                id: fromArray.id,
                name: fromArray.name,
                price: fromArray.price,
                image: fromArray.image,
                images: fromArray.images || [fromArray.image],
                category: fromArray.category || '',
                subcategory: fromArray.subcategory || ''
            };
        }
    }

    if (product) {
        const existingItem = cart.find(item => item.id === parseInt(productId));
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                images: product.images,
                category: product.category,
                subcategory: product.subcategory,
                quantity: 1
            });
        }

        localStorage.setItem('vexzor_cart', JSON.stringify(cart));
        updateCartUI();

        // Show premium toast notification
        showCartToast(product.name, product.image);
    } else {
        console.warn('Product not found for ID:', productId);
    }
}

function showCartToast(name, image) {
    // Remove existing toast if any
    const existing = document.querySelector('.vexzor-cart-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'vexzor-cart-toast';
    toast.innerHTML = `
        <img src="${image}" alt="${name}" class="toast-img">
        <div class="toast-text">
            <strong>${name}</strong>
            <span>Added to cart ✓</span>
        </div>
    `;

    // Inject toast styles if not already present
    if (!document.getElementById('cart-toast-styles')) {
        const style = document.createElement('style');
        style.id = 'cart-toast-styles';
        style.textContent = `
            .vexzor-cart-toast {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #111;
                color: #fff;
                padding: 12px 18px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                gap: 12px;
                z-index: 100000;
                box-shadow: 0 8px 32px rgba(0,0,0,0.4);
                animation: toastSlideIn 0.4s ease, toastSlideOut 0.4s ease 2.4s forwards;
                font-family: 'Outfit', sans-serif;
                border: 1px solid rgba(255,255,255,0.1);
            }
            .vexzor-cart-toast .toast-img {
                width: 50px;
                height: 50px;
                object-fit: cover;
                border-radius: 8px;
            }
            .vexzor-cart-toast .toast-text {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }
            .vexzor-cart-toast .toast-text strong {
                font-size: 0.9rem;
                letter-spacing: 0.5px;
            }
            .vexzor-cart-toast .toast-text span {
                font-size: 0.75rem;
                color: #4ade80;
                font-weight: 600;
            }
            @keyframes toastSlideIn {
                from { transform: translateX(120%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes toastSlideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(120%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function updateCartUI() {
    const cartCounts = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    cartCounts.forEach(el => el.innerText = totalItems);
}

// Update cart count on page load
document.addEventListener('DOMContentLoaded', updateCartUI);
