const openCartBtn = document.getElementById('open-cart-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const sendcartbtn = document.getElementById('send-cart-btn')


openCartBtn.addEventListener('click', () => {
    cartSidebar.classList.add('open');
});

closeCartBtn.addEventListener('click', () => {
    cartSidebar.classList.remove('open');
});

// Логика работы с товарами
const cartItemsContainer = document.querySelector('.cart-items');
const productCards = document.querySelectorAll('.card');

// Объект для хранения количества нажатий на "-" для каждого товара
const cartData = {};

productCards.forEach(card => {
    const plusBtn = card.querySelector('.plus-btn');
    const minusBtn = card.querySelector('.minus-btn');
    const quantityElement = card.querySelector('.quantity');
    const productName = card.querySelector('h3').textContent;
    const price = parseFloat(card.querySelector('p').textContent.replace('Цена: ', '').replace(' рублей', ''));

    
    // Инициализация данных для товара
    cartData[productName] = { quantity: 0, price: price };

    plusBtn.addEventListener('click', () => {
        
        let quantity = parseInt(quantityElement.textContent);
        if (quantity > 0) {
            quantityElement.textContent = quantity - 1;
            cartData[productName].quantity += 1;
            updateCart();
        }
        if(quantity == 1){quantityElement.textContent = 500}
    });

    minusBtn.addEventListener('click', () => {

        let quantity = parseInt(quantityElement.textContent);
        if (quantity < 500) {
            quantityElement.textContent = quantity + 1;
            cartData[productName].quantity -= 1;
            updateCart();
        }
        
    });
});

// Обновление корзины
function updateCart() {
    cartItemsContainer.innerHTML = ''; // Очищаем корзину перед обновлением

    let totalQuantity = 0; // Общая сумма количества
    let totalPrice = 0; // Общая сумма стоимости

    // Добавляем все товары в корзину
    for (const [productName, data] of Object.entries(cartData)) {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <span class="item-name">${productName}</span>
            <span class="item-quantity">${data.quantity}</span>
        `;
        cartItemsContainer.appendChild(cartItem);

        // Суммируем общее количество и стоимость
        totalQuantity += data.quantity;
        totalPrice += data.quantity * data.price;
    }

    // Отображаем общую сумму в заголовке корзины
    const cartHeader = document.querySelector('.cart-header h3');
    cartHeader.textContent = `Корзина/Всего отправлено: ${totalQuantity} на общую сумму ${totalPrice} рублей`;
}

// Логика кнопки "Отправить"
const sendCartBtn = document.getElementById('send-cart-btn');
sendCartBtn.addEventListener('click', () => {
    if(cartItemsContainer.innerHTML == ''){alert('Корзина пуста');}
    else{alert('Корзина отправлена!'); cartItemsContainer.innerHTML = '';}
});