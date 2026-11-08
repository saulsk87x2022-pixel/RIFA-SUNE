// Función global para copiar textos fácilmente
function copyText(text, label) {
    navigator.clipboard.writeText(text).then(() => {
        alert(`📋 ¡${label} copiado al portapapeles!\n\n"${text}"`);
    }).catch(err => {
        console.error('Error al copiar: ', err);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const quantitySelect = document.getElementById('ticketQuantity');
    const totalPriceElement = document.getElementById('totalPrice');
    const buyButton = document.getElementById('buyButton');
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const paymentInfoBox = document.getElementById('paymentInfoBox');
    const stockCountElement = document.getElementById('stockCount');
    
    const fullNameInput = document.getElementById('fullName');
    const userCedulaInput = document.getElementById('userCedula');
    const userPhoneInput = document.getElementById('userPhone');
    const paymentRefInput = document.getElementById('paymentRef');
    const paymentReceiptInput = document.getElementById('paymentReceipt');

    // Stock simulado inicial de boletos disponibles
    let availableStock = 840;

    // Datos oficiales de pago con botones de copiar integrados
    const paymentDetails = {
        pagomovil: `
            <h4>📱 Datos para Pago Móvil</h4>
            <p><span><strong>Banco:</strong> Banco de Venezuela (0102)</span></p>
            <p><span><strong>Teléfono:</strong> 04241593168</span> <button class="copy-btn" onclick="copyText('04241593168', 'Teléfono')">Copiar</button></p>
            <p><span><strong>Cédula:</strong> 25887840</span> <button class="copy-btn" onclick="copyText('25887840', 'Cédula')">Copiar</button></p>
        `,
        binance: `
            <h4>🟡 Datos para Binance Pay (USDT)</h4>
            <p><span><strong>Correo / Pay ID:</strong> aliannis2502@gmail.com</span> <button class="copy-btn" onclick="copyText('aliannis2502@gmail.com', 'Correo')">Copiar</button></p>
            <p>Envía el monto exacto en USDT y adjunta tu comprobante.</p>
        `,
        zinli: `
            <h4>💳 Zinli</h4>
            <p>Este método se encuentra bloqueado temporalmente.</p>
        `,
        paypal: `
            <h4>🅿️ PayPal</h4>
            <p>Este método se encuentra bloqueado temporalmente.</p>
        `
    };

    function updatePaymentInfo() {
        const selectedMethod = paymentMethodSelect.value;
        paymentInfoBox.innerHTML = paymentDetails[selectedMethod] || '';
    }

    paymentMethodSelect.addEventListener('change', updatePaymentInfo);
    updatePaymentInfo();

    // Actualizar precio automáticamente al cambiar cantidad
    quantitySelect.addEventListener('change', (e) => {
        const qty = parseInt(e.target.value);
        const unitPrice = 30; // 10 tickets = 300 Bs.f
        const total = qty * unitPrice;
        totalPriceElement.textContent = `${total.toLocaleString()} Bs.f`;
    });

    // Acción del botón de confirmar pago
    buyButton.addEventListener('click', () => {
        const name = fullNameInput.value.trim();
        const cedula = userCedulaInput.value.trim();
        const phone = userPhoneInput.value.trim();
        const ref = paymentRefInput.value.trim();
        const qty = parseInt(quantitySelect.value);
        const total = totalPriceElement.textContent;
        const method = paymentMethodSelect.options[paymentMethodSelect.selectedIndex].text;
        const hasReceipt = paymentReceiptInput.files.length > 0;

        if (!name || !cedula || !phone || !ref) {
            alert('⚠️ Por favor completa todos tus datos personales y la referencia de pago.');
            return;
        }

        if (!hasReceipt) {
            alert('⚠️ Por favor adjunta el capture o comprobante de tu pago antes de confirmar.');
            return;
        }

        if (qty > availableStock) {
            alert('⚠️ Lo sentimos, no hay suficientes boletos disponibles en este momento para esa cantidad.');
            return;
        }

        // Restar los boletos del stock en vivo
        availableStock -= qty;
        stockCountElement.textContent = availableStock;

        alert(`✅ ¡Pago y Registro Confirmados con Éxito!\n\nParticipante: ${name}\nCédula: ${cedula}\nBoletos Adquiridos: ${qty}\nTotal Pagado: ${total}\nMétodo: ${method}\nReferencia: ${ref}\n\n¡Tus números han sido apartados y el stock se ha actualizado!`);
        
        // Limpiar campos clave
        paymentRefInput.value = '';
        paymentReceiptInput.value = '';
    });
});
