document.addEventListener('DOMContentLoaded', () => {
    const quantitySelect = document.getElementById('ticketQuantity');
    const totalPriceElement = document.getElementById('totalPrice');
    const buyButton = document.getElementById('buyButton');
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const paymentInfoBox = document.getElementById('paymentInfoBox');
    
    const fullNameInput = document.getElementById('fullName');
    const userCedulaInput = document.getElementById('userCedula');
    const userPhoneInput = document.getElementById('userPhone');
    const paymentRefInput = document.getElementById('paymentRef');
    const paymentReceiptInput = document.getElementById('paymentReceipt');

    // Datos oficiales de pago
    const paymentDetails = {
        pagomovil: `
            <h4>📱 Datos para Pago Móvil</h4>
            <p><strong>Banco:</strong> Banco de Venezuela (0102)</p>
            <p><strong>Teléfono:</strong> 0424-1593168</p>
            <p><strong>Cédula:</strong> V-25.887.840</p>
        `,
        binance: `
            <h4>🟡 Datos para Binance Pay (USDT)</h4>
            <p><strong>Correo / Pay ID:</strong> aliannis2502@gmail.com</p>
            <p>Envía el monto exacto en USDT y adjunta tu comprobante.</p>
        `,
        zinli: `
            <h4>💳 Datos para Zinli</h4>
            <p><strong>Correo / Cuenta:</strong> aliannis2502@gmail.com</p>
            <p>Efectúa tu pago y coloca el número de referencia.</p>
        `,
        paypal: `
            <h4>🅿️ Datos para PayPal</h4>
            <p><strong>Correo:</strong> aliannis2502@gmail.com</p>
            <p>Asegúrate de cubrir las comisiones si aplica.</p>
        `,
        transferencia: `
            <h4>🏦 Transferencia Bancaria Nacional</h4>
            <p><strong>Banco:</strong> Banco de Venezuela</p>
            <p><strong>Cuenta:</strong> Usar datos de Pago Móvil</p>
        `
    };

    function updatePaymentInfo() {
        const selectedMethod = paymentMethodSelect.value;
        paymentInfoBox.innerHTML = paymentDetails[selectedMethod] || '';
    }

    paymentMethodSelect.addEventListener('change', updatePaymentInfo);
    updatePaymentInfo();

    // Actualizar precio automáticamente
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
        const qty = quantitySelect.value;
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

        alert(`✅ ¡Pago y Registro Confirmados con Éxito!\n\nParticipante: ${name}\nCédula: ${cedula}\nBoletos: ${qty}\nTotal: ${total}\nMétodo: ${method}\nReferencia: ${ref}\nComprobante adjuntado correctamente.\n\n¡Tus números han sido apartados!`);
    });
});
