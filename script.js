document.addEventListener('DOMContentLoaded', function() {
    const products = document.querySelectorAll('.product');
    const cartItems = document.querySelector('.cart-items');
    const totalElement = document.querySelector('.total');
    const checkoutButton = document.getElementById('checkout-btn');
    let cart = []; // Массив для хранения выбранных товаров

    products.forEach(product => {
        const price = parseFloat(product.getAttribute('data-price'));

        const quantityInput = product.querySelector('.quantity-input');
        const addButton = product.querySelector('.plus');
        const minusButton = product.querySelector('.minus');
        const detailsBtn = product.querySelector('.details-btn');
        const details = product.querySelector('.details');
        const hideBtn = product.querySelector('.hide-btn');

        addButton.addEventListener('click', function() {
            let currentValue = parseInt(quantityInput.value);
            currentValue++;
            quantityInput.value = currentValue;
            updateTotal();
            addToCart(product, currentValue, price);
        });

        minusButton.addEventListener('click', function() {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue > 0) {
                currentValue--;
                quantityInput.value = currentValue;
                updateTotal();
                updateCartItem(product, currentValue);
            } else {
                removeCartItem(product);
            }
        });

        detailsBtn.addEventListener('click', function() {
            details.style.display = 'block';
            hideBtn.style.display = 'block';
            detailsBtn.style.display = 'none';
        });

        hideBtn.addEventListener('click', function() {
            details.style.display = 'none';
            hideBtn.style.display = 'none';
            detailsBtn.style.display = 'block';
        });
    });

    checkoutButton.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Добавьте товары в корзину перед оформлением заказа.');
            return;
        }

        const totalPrice = calculateTotalPrice();
        if (totalPrice === 0) {
            alert('Добавьте товары в корзину перед оформлением заказа.');
            return;
        }

        const confirmation = confirm(`Общая сумма заказа: $${totalPrice.toFixed(2)}. Желаете продолжить оформление?`);
        if (!confirmation) {
            return;
        }

        const orderData = prepareOrderData();

        // Отправка данных корзины в Telegram бот
        Telegram.WebApp.sendData(JSON.stringify(orderData));

        // Оповещение пользователя о том, что заказ отправлен в Telegram
        alert('Информация о вашем заказе отправлена в Telegram.');
    });

    function addToCart(product, quantity, price) {
        const productName = product.querySelector('h2').innerText;
        const itemPrice = price * quantity;
        const cartItem = {
            name: productName,
            quantity: quantity,
            price: itemPrice
        };
        const existingItem = cart.find(item => item.name === productName);
        if (existingItem) {
            existingItem.quantity = quantity;
            existingItem.price = itemPrice;
        } else {
            cart.push(cartItem);
        }
        updateCartUI();
    }

    function updateCartItem(product, quantity) {
        const productName = product.querySelector('h2').innerText;
        const itemPrice = parseFloat(product.getAttribute('data-price')) * quantity;
        const existingItem = cart.find(item => item.name === productName);
        if (existingItem) {
            existingItem.quantity = quantity;
            existingItem.price = itemPrice;
        }
        updateCartUI();
    }

    function removeCartItem(product) {
        const productName = product.querySelector('h2').innerText;
        const index = cart.findIndex(item => item.name === productName);
        if (index !== -1) {
            cart.splice(index, 1);
        }
        updateCartUI();
    }

    function updateCartUI() {
        cartItems.innerHTML = '';
        cart.forEach(item => {
            const cartItemElement = document.createElement('li');
            cartItemElement.innerHTML = `
                ${item.name} - <span class="quantity-text">${item.quantity}</span> шт. - <span class="item-price">$${item.price.toFixed(2)}</span>
            `;
            cartItems.appendChild(cartItemElement);
        });
        updateTotal();
    }

    function updateTotal() {
        const totalPrice = calculateTotalPrice();
        totalElement.innerText = `Общая сумма: $${totalPrice.toFixed(2)}`;
    }

    function calculateTotalPrice() {
        return cart.reduce((total, item) => total + item.price, 0);
    }

    function prepareOrderData() {
        return cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price * 100 // Telegram ожидает сумму в центах
        }));
    }
});
