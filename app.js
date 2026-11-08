// URL de tu API de Google Apps Script
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzINDL95vcOFsG9mpn4Gb5hbztly7DJxLK-5mTdQ6Lx0lJbzS6fBSRvz_8z_x9DbFVFoA/exec";

// Función para copiar textos individuales al portapapeles
function copyText(text, label) {
    navigator.clipboard.writeText(text).then(() => {
        alert(`📋 ¡${label} copiado exitosamente!\n\n"${text}"`);
    }).catch(err => {
        console.error('Error al copiar: ', err);
    });
}

// Cargar el stock real desde Google Sheets al abrir la página
async function loadStock() {
    try {
        const response = await fetch(SCRIPT_URL);
        const data = await response.json();
        if (data && data.stock !== undefined) {
            document.getElementById('stockCount').textContent = Number(data.stock).toLocaleString();
        }
    } catch (error) {
        console.error('Error al cargar el stock:', error);
    }
}

// Convertir imagen a Base64
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadStock(); // Consultar stock al iniciar

    const quantitySelect = document.getElementById('ticketQuantity');
    const totalPriceElement = document.getElementById('totalPrice');
    const buyButton = document.getElementById('buyButton');
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const paymentInfoBox = document.getElementById('paymentInfoBox');
    
    const fullNameInput = document.getElementById('fullName');
    const userCedulaInput = document.getElementById('userCedula');
    const userPhoneInput = document.getElementById('userPhone');
    const userStateSelect = document.getElementById('userState');
    const sourceBankSelect = document.getElementById('sourceBank');
    const paymentRefInput = document.getElementById('paymentRef');
    const paymentReceiptInput = document.getElementById('paymentReceipt');

    // Datos de pago con filas independientes para copiar cada dato exacto
    const paymentDetails = {
        pagomovil: `
            <h4>📱 Datos para Pago Móvil</h4>
            <div class="payment-row">
                <span><strong>Banco:</strong> Banco de Venezuela (0102)</span>
                <button class="copy-btn" onclick="copyText('0102', 'Banco')">Copiar</button>
            </div>
            <div class="payment-row">
                <span><strong>Teléfono:</strong> 04241593168</span>
                <button class="copy-btn" onclick="copyText('04241593168', 'Teléfono')">Copiar</button>
            </div>
            <div class="payment-row">
                <span><strong>Cédula:</strong> 25887840</span>
                <button class="copy-btn" onclick="copyText('25887840', 'Cédula')">Copiar</button>
            </div>
        `,
        binance: `
            <h4>🟡 Datos para Binance Pay (USDT)</h4>
            <div class="payment-row">
                <span><strong>Correo:</strong> aliannis2502@gmail.com</span>
                <button class="copy-btn" onclick="copyText('aliannis2502@gmail.com', 'Correo')">Copiar</button>
            </div>
            <p style="margin-top:8px; font-size:0.8rem; color:#78350f;">Envía el monto exacto en USDT y adjunta tu comprobante.</p>
        `,
        zinli: `
            <h4>💳 Zinli</h4>
            <p style="color:#78350f;">Este método se encuentra bloqueado temporalmente.</p>
        `,
        paypal: `
            <h4>🅿️ PayPal</h4>
            <p style="color:#78350f;">Este método se encuentra bloqueado temporalmente.</p>
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
    buyButton.addEventListener('click', async () => {
        const name = fullNameInput.value.trim();
        const cedula = userCedulaInput.value.trim();
        const phone = userPhoneInput.value.trim();
        const state = userStateSelect.value;
        const bank = sourceBankSelect.value;
        const ref = paymentRefInput.value.trim();
        const qty = parseInt(quantitySelect.value);
        const total = totalPriceElement.textContent;
        const method = paymentMethodSelect.options[paymentMethodSelect.selectedIndex].text;

        if (!name || !cedula || !phone || !state || !ref) {
            alert('⚠️ Por favor completa todos tus datos personales, estado de procedencia y la referencia de pago.');
            return;
        }

        if (paymentReceiptInput.files.length === 0) {
            alert('⚠️ Por favor adjunta el capture o comprobante de tu pago antes de confirmar.');
            return;
        }

        // Deshabilitar botón mientras procesa
        buyButton.disabled = true;
        buyButton.textContent = "Procesando pago y asignando números...";

        try {
            // Convertir la imagen adjunta a Base64
            let base64Image = "";
            if (paymentReceiptInput.files.length > 0) {
                base64Image = await getBase64(paymentReceiptInput.files[0]);
            }

            const payload = {
                fullName: name,
                userCedula: cedula,
                userPhone: phone,
                userState: state,
                ticketQuantity: qty,
                paymentMethod: method,
                sourceBank: bank,
                paymentRef: ref,
                receiptImage: base64Image
            };

            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            alert(`✅ ¡Registro y Solicitud Enviados con Éxito!\n\nParticipante: ${name}\nCédula: ${cedula}\nEstado: ${state}\nBoletos Solicitados: ${qty}\nMétodo: ${method}\nReferencia: ${ref}\n\n⏳ Tus números han sido apartados y están PENDIENTES DE VERIFICACIÓN DE PAGO.`);
            
            // Limpiar formulario
            fullNameInput.value = '';
            userCedulaInput.value = '';
            userPhoneInput.value = '';
            paymentRefInput.value = '';
            paymentReceiptInput.value = '';
            
            // Actualizar stock en pantalla tras 2 segundos
            setTimeout(loadStock, 2000);

        } catch (error) {
            console.error('Error al enviar los datos:', error);
            alert('Hubo un error al conectar con el servidor. Por favor intenta de nuevo.');
        } finally {
            buyButton.disabled = false;
            buyButton.textContent = "Confirmar y Enviar Pago";
        }
    });
});
