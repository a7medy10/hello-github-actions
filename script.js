const products = [
    { id: 1, name: 'Laptop', price: 1000 },
    { id: 2, name: 'Computer Case', price: 100 },
    { id: 3, name: 'Graphics Card', price: 500 },
];

const cartItems = [];

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cartItems.push(product);
        renderCart();
    }
}

function renderCart() {
    const cartItemsElement = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');

    cartItemsElement.innerHTML = '';
    let total = 0;

    cartItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - $${item.price}`;
        cartItemsElement.appendChild(li);
        total += item.price;
    });

    cartTotalElement.textContent = total;
}

document.querySelectorAll('.product button').forEach((button, index) => {
    button.addEventListener('click', () => {
        addToCart(products[index].id);
    });
});

const checkoutButton = document.getElementById('checkout-button');
const checkoutSection = document.getElementById('checkout');
const checkoutForm = document.getElementById('checkout-form');

checkoutButton.addEventListener('click', () => {
    checkoutSection.style.display = 'block';
});

checkoutForm.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Order placed successfully!');
    cartItems.length = 0;
    renderCart();
    checkoutSection.style.display = 'none';
});
