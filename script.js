document.addEventListener('DOMContentLoaded', function() {
    const products = document.querySelectorAll('.product');
    const cartItems = document.querySelector('.cart-items');
    const totalElement = document.querySelector('.total');
    const checkoutButton = document.getElementById('checkout-btn');
    let totalAmount = 0;
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

        // Подготовка данных о корзине для отправки
        const orderData = prepareOrderData();

        // Создание и отображение всплывающего окна с суммой оплаты
        TelegramWebApp.openPaymentForm({
            payload: 'payload',
            provider_token: 'YOUR_PAYMENT_PROVIDER_TOKEN',
            start_parameter: 'test-start',
            prices: orderData.map(item => ({ label: item.name, amount: item.price }))
        });

        // Обработка успешной оплаты
        TelegramWebApp.onPaymentSuccessful((payment) => {
            // Очистка корзины и обновление интерфейса
            cart = [];
            cartItems.innerHTML = '';
            totalElement.innerText = 'Общая сумма: $0';
            
            // Отправка сообщения о успешной оплате в Telegram
            alert('Спасибо за оплату! Ваш заказ будет обработан.');
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
        cart.push(cartItem);

        // Проверяем, есть ли уже такой товар в корзине
        let existingItem = cartItems.querySelector(`li[data-product="${productName}"]`);
        if (existingItem) {
            existingItem.querySelector('.quantity-text').innerText = quantity;
            existingItem.querySelector('.item-price').innerText = `$${itemPrice.toFixed(2)}`;
        } else {
            const cartItemElement = document.createElement('li');
            cartItemElement.setAttribute('data-product', productName);
            cartItemElement.innerHTML = `
                ${productName} - <span class="quantity-text">${quantity}</span> шт. - <span class="item-price">$${itemPrice.toFixed(2)}</span>
            `;
            cartItems.appendChild(cartItemElement);
        }
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

        let existingItem = cartItems.querySelector(`li[data-product="${productName}"]`);
        if (existingItem) {
            existingItem.querySelector('.quantity-text').innerText = quantity;
            existingItem.querySelector('.item-price').innerText = `$${itemPrice.toFixed(2)}`;
        }
        updateTotal();
    }

    function removeCartItem(product) {
        const productName = product.querySelector('h2').innerText;
        let existingItem = cartItems.querySelector(`li[data-product="${productName}"]`);
        if (existingItem) {
            cartItems.removeChild(existingItem);

            // Удаление товара из массива корзины
            cart = cart.filter(item => item.name !== productName);
        }
        updateTotal();
    }

    function updateTotal() {
        let total = 0;
        const cartItemsList = cartItems.querySelectorAll('li');
        cartItemsList.forEach(item => {
            const itemPrice = parseFloat(item.querySelector('.item-price').innerText.split('$')[1]);
            total += itemPrice;
        });
        totalElement.innerText = `Общая сумма: $${total.toFixed(2)}`;
    }

    function prepareOrderData() {
        const orderData = cart.map(item => {
            return {
                name: item.name,
                quantity: item.quantity,
                price: item.price
            };
        });
        return orderData;
    }
});
