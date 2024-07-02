document.addEventListener('DOMContentLoaded', function() {
    const products = document.querySelectorAll('.product');
    const cartItems = document.querySelector('.cart-items');
    const totalElement = document.querySelector('.total');
    let totalAmount = 0;

    products.forEach(product => {
        const price = parseFloat(product.getAttribute('data-price'));

        const quantityInput = product.querySelector('.quantity-input');
        const addButton = product.querySelector('.plus');
        const minusButton = product.querySelector('.minus');

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
    });

    function addToCart(product, quantity, price) {
        const productName = product.querySelector('h2').innerText;
        const itemPrice = price * quantity;

        // Проверяем, есть ли уже такой товар в корзине
        let existingItem = cartItems.querySelector(`li[data-product="${productName}"]`);
        if (existingItem) {
            existingItem.querySelector('.quantity-text').innerText = quantity;
            existingItem.querySelector('.item-price').innerText = `$${itemPrice.toFixed(2)}`;
        } else {
            const cartItem = document.createElement('li');
            cartItem.setAttribute('data-product', productName);
            cartItem.innerHTML = `
                ${productName} - <span class="quantity-text">${quantity}</span> шт. - <span class="item-price">$${itemPrice.toFixed(2)}</span>
            `;
            cartItems.appendChild(cartItem);
        }
        updateTotal();
    }

    function updateCartItem(product, quantity) {
        const productName = product.querySelector('h2').innerText;
        const itemPrice = parseFloat(product.getAttribute('data-price')) * quantity;

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
});
