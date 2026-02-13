// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');
const cartModal = document.getElementById('cartModal');
const cartIcon = document.querySelector('.cart-icon');
const closeCart = document.getElementById('closeCart');
const cartBody = document.getElementById('cartBody');
const cartTotal = document.getElementById('cartTotal');
const emptyCart = document.getElementById('emptyCart');
const checkoutBtn = document.getElementById('checkoutBtn');
const featuredProductsContainer = document.getElementById('featured-products-container');
const contactForm = document.getElementById('contactForm');
const newsletterForm = document.getElementById('newsletterForm');

// Products Data
const products = [
    {
        id: 1,
        name: "Samsung Galaxy S23",
        description: "Latest smartphone with advanced camera and performance",
        price: 899,
        category: "smartphones",
        badge: "New",
        icon: "fas fa-mobile-alt"
    },
    {
        id: 2,
        name: "Apple MacBook Pro 14\"",
        description: "Powerful laptop for professionals and creatives",
        price: 1999,
        category: "laptops",
        badge: "Best Seller",
        icon: "fas fa-laptop"
    },
    {
        id: 3,
        name: "Sony 65\" 4K OLED TV",
        description: "Immersive entertainment with perfect blacks",
        price: 1799,
        category: "tv",
        badge: "Sale",
        icon: "fas fa-tv"
    },
    {
        id: 4,
        name: "Bose QuietComfort 45",
        description: "Noise cancelling headphones with premium sound",
        price: 329,
        category: "audio",
        badge: "Popular",
        icon: "fas fa-headphones"
    },
    {
        id: 5,
        name: "iPhone 14 Pro",
        description: "Apple's flagship with Dynamic Island",
        price: 999,
        category: "smartphones",
        badge: "New",
        icon: "fas fa-mobile-alt"
    },
    {
        id: 6,
        name: "Dyson V11 Vacuum",
        description: "Cordless vacuum with powerful suction",
        price: 599,
        category: "appliances",
        badge: "Trending",
        icon: "fas fa-home"
    }
];

// Cart Data
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartCount = document.querySelector('.cart-count');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Load featured products
    loadFeaturedProducts();
    
    // Update cart count
    updateCartCount();
    
    // Setup event listeners
    setupEventListeners();
});

// Load Featured Products
function loadFeaturedProducts() {
    featuredProductsContainer.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <i class="${product.icon}"></i>
                <span class="product-badge">${product.badge}</span>
            </div>
            <div class="product-content">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <div class="product-price">$${product.price}</div>
                    <div class="add-to-cart" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </div>
                </div>
            </div>
        `;
        
        featuredProductsContainer.appendChild(productCard);
    });
    
    // Add event listeners to add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Hamburger menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Cart icon click
    cartIcon.addEventListener('click', function(e) {
        e.preventDefault();
        cartModal.classList.add('active');
        updateCartDisplay();
    });
    
    // Close cart
    closeCart.addEventListener('click', function() {
        cartModal.classList.remove('active');
    });
    
    // Close cart when clicking outside
    document.addEventListener('click', function(e) {
        if (!cartModal.contains(e.target) && !cartIcon.contains(e.target)) {
            cartModal.classList.remove('active');
        }
    });
    
    // Contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (name && email && message) {
                // In a real app, you would send this data to a server
                alert(`Thank you ${name}! Your message has been sent. We will contact you at ${email} soon.`);
                contactForm.reset();
            } else {
                alert('Please fill in all required fields.');
            }
        });
    }
    
    // Newsletter form submission
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (email) {
                alert(`Thank you for subscribing with ${email}! You'll receive our updates soon.`);
                this.reset();
            }
        });
    }
    
    // Checkout button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length > 0) {
                alert('Proceeding to checkout. In a real store, this would redirect to a payment page.');
                // Clear cart after checkout
                cart = [];
                saveCartToStorage();
                updateCartCount();
                updateCartDisplay();
                cartModal.classList.remove('active');
            } else {
                alert('Your cart is empty. Add some products first.');
            }
        });
    }
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (product) {
        // Check if product already in cart
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                icon: product.icon
            });
        }
        
        // Save to localStorage
        saveCartToStorage();
        
        // Update UI
        updateCartCount();
        
        // Show notification
        showNotification(`${product.name} added to cart!`);
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartCount();
    updateCartDisplay();
}

function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function updateCartDisplay() {
    cartBody.innerHTML = '';
    
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        checkoutBtn.disabled = true;
    } else {
        emptyCart.style.display = 'none';
        checkoutBtn.disabled = false;
        
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <i class="${item.icon}"></i>
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price} x ${item.quantity}</div>
                </div>
                <div class="cart-item-remove" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </div>
            `;
            
            cartBody.appendChild(cartItem);
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                removeFromCart(productId);
            });
        });
        
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }
}

function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--success);
        color: white;
        padding: 15px 25px;
        border-radius: 4px;
        box-shadow: var(--shadow);
        z-index: 2000;
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
    `;
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
        style.remove();
    }, 3000);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        if (targetId !== '#') {
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        }
    });
});