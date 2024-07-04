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
            addToCart(product, currentValue, price);
        });

        minusButton.addEventListener('click', function() {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue > 0) {
                currentValue--;
                quantityInput.value = currentValue;
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
        const totalPrice = calculateTotal();

        if (totalPrice === 0) {
            alert('Добавьте товары в корзину перед оформлением заказа.');
            return;
        }

        // Подготовка данных о корзине для отправки
        const orderData = prepareOrderData();

        // Создание и отображение всплывающего окна с суммой оплаты
        Telegram.WebApp.showPopup({
            title: "Оформление заказа",
            message: `Общая сумма для оплаты: $${totalPrice.toFixed(2)}`,
            buttons: [
                { id: 'pay', type: 'ok', text: 'Оплатить' },
                { id: 'cancel', type: 'cancel', text: 'Отмена' }
            ]
        });

        // Обработка нажатия кнопки в всплывающем окне
        Telegram.WebApp.onEvent('popupClosed', function(event) {
            if (event.button_id === 'pay') {
                // Отправка команды /buy в Telegram для создания инвойса
                Telegram.WebApp.sendData(JSON.stringify(orderData));
            }
        });
    });

    function addToCart(product, quantity, price) {
        const productName = product.querySelector('h2').innerText;
        const itemPrice = price * quantity;

        // Добавление товара в массив корзины
        const cartItem = {
            name: productName,
            quantity: quantity,
            price: itemPrice
        };

        // Проверяем, есть ли уже такой товар в корзине
        const existingIndex = cart.findIndex(item => item.name === productName);
        if (existingIndex !== -1) {
            cart[existingIndex] = cartItem;
        } else {
            cart.push(cartItem);
        }

        updateCartDisplay();
        updateTotal();
    }

    function updateCartItem(product, quantity) {
        const productName = product.querySelector('h2').innerText;
        const itemPrice = parseFloat(product.getAttribute('data-price')) * quantity;

        // Обновляем данные товара в массиве корзины
        cart.forEach(item => {
            if (item.name === productName) {
                item.quantity = quantity;
                item.price = itemPrice;
            }
        });

        updateCartDisplay();
        updateTotal();
    }

    function removeCartItem(product) {
        const productName = product.querySelector('h2').innerText;

        // Удаление товара из массива корзины
        cart = cart.filter(item => item.name !== productName);

        updateCartDisplay();
        updateTotal();
    }

    function updateCartDisplay() {
        cartItems.innerHTML = '';
        cart.forEach(item => {
            const cartItemElement = document.createElement('li');
            cartItemElement.setAttribute('data-product', item.name);
            cartItemElement.innerHTML = `
                ${item.name} - <span class="quantity-text">${item.quantity}</span> шт. - <span class="item-price">$${item.price.toFixed(2)}</span>
            `;
            cartItems.appendChild(cartItemElement);
        });
    }

    function updateTotal() {
        const totalPrice = calculateTotal();
        totalElement.innerText = `Общая сумма: $${totalPrice.toFixed(2)}`;
    }

    function calculateTotal() {
        return cart.reduce((acc, item) => acc + item.price, 0);
    }

    function prepareOrderData() {
        return cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
        }));
    }
});
