function orderProduct(productName) {
    Telegram.WebApp.showPopup({
        title: 'Оформить заказ',
        message: `Вы хотите оформить заказ на ${productName}?`,
        buttons: [
            {
                type: 'ok',
                text: 'Да',
                callback: () => {
                    Telegram.WebApp.openInvoice({
                        description: `Оплата за ${productName}`,
                        payload: 'custom_payload',
                        provider_token: 'YOUR_PROVIDER_TOKEN',
                        currency: 'RUB',
                        prices: [{ label: productName, amount: 10000 }] // 100 рублей
                    });
                }
            },
            {
                type: 'cancel',
                text: 'Нет'
            }
        ]
    });
}

Telegram.WebApp.ready();
