document.addEventListener('DOMContentLoaded', () => {
    const quantitySelect = document.getElementById('ticketQuantity');
    const totalPriceElement = document.getElementById('totalPrice');
    const buyButton = document.getElementById('buyButton');
    const paymentMethodSelect = document.getElementById('paymentMethod');

    // Actualizar precio automáticamente al cambiar la cantidad
    quantitySelect.addEventListener('change', (e) => {
        const qty = parseInt(e.target.value);
        // Base: 10 tickets = 300 Bs.f (30 Bs por ticket)
        const unitPrice = 30;
        const total = qty * unitPrice;
        
        totalPriceElement.textContent = `${total.toLocaleString()} Bs.f`;
    });

    // Acción del botón de compra
    buyButton.addEventListener('click', () => {
        const qty = quantitySelect.value;
        const total = totalPriceElement.textContent;
        const method = paymentMethodSelect.options[paymentMethodSelect.selectedIndex].text;

        alert(`¡Excelente elección!\n\nHas seleccionado: ${qty} Boletos\nTotal: ${total}\nMétodo de pago: ${method}\n\nSerás redirigido para confirmar tu pago y apartar tus números.`);
    });
});
