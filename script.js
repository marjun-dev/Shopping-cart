
let products = [
    {
        "id": 1,
        "name": "Iphone",
        "image": "iphone.jpg",
        "price": 80000
    },
    {
        "id": 2,
        "name": "HP Laptop",
        "image": "hp.jpg",
        "price": 54000
    },
    {
        "id": 3,
        "name": "Sony Headphones",
        "image": "sony.jpg",
        "price": 5000
    }
];

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function displayProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <p>${product.name} - $${product.price.toFixed(2)}</p>
                <div class="quantity-control">
                    <button onclick="changeQuantity(${product.id}, -1)">-</button>
                    <span id="quantity-${product.id}">1</span>
                    <button onclick="changeQuantity(${product.id}, 1)">+</button>
                </div>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
        productList.appendChild(productDiv);
    });
}

function changeQuantity(productId, amount) {
    const quantityElement = document.getElementById(`quantity-${productId}`);
    let quantity = parseInt(quantityElement.textContent) + amount;

    if (quantity < 1) quantity = 1;
    quantityElement.textContent = quantity;
}

function addToCart(productId) {
    const quantityElement = document.getElementById(`quantity-${productId}`);
    const quantity = parseInt(quantityElement.textContent);
    const product = products.find(p => p.id === productId);

    let cart = getCart();
    const existingProduct = cart.find(item => item.id === productId);
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push({ ...product, quantity: quantity });
    }
    saveCart(cart);
}

function goToCart() {
    window.location.href = 'cart.html';
}

function updateCart(cartItems = getCart()) {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';

    cartItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}" width="100">
            <p>${item.name} - $${item.price.toFixed(2)} x ${item.quantity}</p>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItemsContainer.appendChild(itemDiv);
    });

    document.getElementById('total-price').textContent = getTotalPrice();
    document.getElementById('average-price').textContent = getAveragePrice();
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    updateCart();
}

function getTotalPrice() {
    return getCart().reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
}

function getAveragePrice() {
    const cart = getCart();
    const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    return count === 0 ? 0 : (total / count).toFixed(2);
}

function filterProducts() {
    const minPrice = parseFloat(document.getElementById('filter-price').value) || 0;
    const filtered = products.filter(product => product.price >= minPrice);
    displayProducts(filtered);
}

function sortCart(order) {
    let cart = getCart();
    const sorted = cart.sort((a, b) => order === 'ascending' ? a.price - b.price : b.price - a.price);
    updateCart(sorted);
}

function clearCart() {
    saveCart([]);
    updateCart();
}

function placeOrder() {
    alert('Order placed successfully!');
    clearCart();
}


document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('index.html')) {
        displayProducts();
    }
    if (window.location.pathname.endsWith('cart.html')) {
        updateCart();
    }
});
