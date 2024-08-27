function orderProduct(productName) {
    const productPrice = 10; // Цена в рублях (помните, что Telegram ожидает цену в копейках)

    Telegram.WebApp.openInvoice({
        title: 'Оформить заказ',
        description: `Оплата за ${productName}`,
        payload: `order_${productName}`,
        provider_token: '381764678:TEST:89085',  // Замените на ваш токен провайдера оплаты
        currency: 'RUB',
        prices: [
            { label: productName, amount: productPrice * 100 } // умножаем на 100, чтобы перевести рубли в копейки
        ],
        max_tip_amount: 0, // Если не хотите использовать чаевые
        suggested_tip_amounts: [],
        start_parameter: 'pay',
        need_name: true,  // Если хотите запросить у пользователя имя
        need_phone_number: false,  // Если хотите запросить телефонный номер
        need_email: false,  // Если хотите запросить email
        need_shipping_address: false,  // Если хотите запросить адрес доставки
        send_phone_number_to_provider: false,
        send_email_to_provider: false,
        is_flexible: false  // Если цена фиксированная, то false
    });
}

Telegram.WebApp.ready();
