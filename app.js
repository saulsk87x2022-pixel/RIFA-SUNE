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

    // Datos detallados según el método de pago seleccionado
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
            <p>Envía el monto exacto en USDT y anota tu referencia.</p>
        `,
        zinli: `
            <h4>💳 Datos para Zinli</h4>
            <p><strong>Correo / Cuenta:</strong> aliannis2502@gmail.com</p>
            <p>Efectúa tu pago y coloca el número de confirmación.</p>
        `,
        paypal: `
            <h4>🅿️ Datos para PayPal</h4>
            <p><strong>Correo:</strong> aliannis2502@gmail.com</p>
            <p>Asegúrate de cubrir las comisiones de envío si aplica.</p>
        `,
        transferencia: `
            <h4>🏦 Transferencia Bancaria Nacional</h4>
            <p><strong>Banco:</strong> Banco de Venezuela</p>
            <p><strong>Cuenta:</strong> Consultar por WhatsApp o usar Pago Móvil</p>
        `
    };

    // Función para actualizar los datos bancarios en pantalla
    function updatePaymentInfo() {
        const selectedMethod = paymentMethodSelect.value;
        paymentInfoBox.innerHTML = paymentDetails[selectedMethod] || '';
    }

    // Ejecutar al cargar y al cambiar de opción
    paymentMethodSelect.addEventListener('change', updatePaymentInfo);
    updatePaymentInfo();

    // Actualizar precio automáticamente al cambiar la cantidad de boletos
    quantitySelect.addEventListener('change', (e) => {
        const qty = parseInt(e.target.value);
        const unitPrice = 30; // 10 tickets = 300 Bs.f
        const total = qty * unitPrice;
        totalPriceElement.textContent = `${total.toLocaleString()} Bs.f`;
    });

    // Acción al hacer clic en reservar
    buyButton.addEventListener('click', () => {
        const name = fullNameInput.value.trim();
        const cedula = userCedulaInput.value.trim();
        const phone = userPhoneInput.value.trim();
        const ref = paymentRefInput.value.trim();
        const qty = quantitySelect.value;
        const total = totalPriceElement.textContent;
        const method = paymentMethodSelect.options[paymentMethodSelect.selectedIndex].text;

        if (!name || !cedula || !phone || !ref) {
            alert('⚠️ Por favor completa todos tus datos personales y la referencia de pago antes de continuar.');
            return;
        }

        alert(`✅ ¡Registro de Reserva Exitoso!\n\nParticipante: ${name}\nCédula: ${cedula}\nTeléfono: ${phone}\nBoletos: ${qty}\nTotal: ${total}\nMétodo: ${method}\nReferencia: ${ref}\n\n¡Tus datos han sido registrados con éxito! Pronto validaremos tu pago.`);
    });
});
