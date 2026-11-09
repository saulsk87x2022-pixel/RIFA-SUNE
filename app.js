// URL de tu Google Apps Script desplegado
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx0nxL_P7_yJWTSJFO-wv5CqPkrUeDbYsWTOKwjqZZfFoCtcYSODy_dQkNNRxGLzNf3Hg/exec";

// 1. Cargar el stock real y configurar precios al abrir la página
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(WEB_APP_URL + "?action=getStock");
        const data = await response.json();
        const stockElement = document.getElementById("stockCount");
        if (stockElement) {
            stockElement.innerText = data.stock !== undefined ? data.stock : 9999;
        }
    } catch (e) {
        console.log("No se pudo cargar el stock en tiempo real, usando valor por defecto.");
    }

    // Selector dinámico de precios según la cantidad de boletos
    const quantitySelect = document.getElementById("ticketQuantity");
    const totalPriceElement = document.getElementById("totalPrice");
    
    if (quantitySelect && totalPriceElement) {
        const prices = { 
            "10": "300 Bs.f", 
            "20": "600 Bs.f", 
            "30": "900 Bs.f", 
            "50": "1,500 Bs.f", 
            "100": "3,000 Bs.f" 
        };
        
        // Función para actualizar el precio dinámicamente
        const updatePrice = () => {
            const selectedVal = quantitySelect.value;
            totalPriceElement.innerText = prices[selectedVal] || "300 Bs.f";
        };

        // Escuchar cambios y actualizar de inmediato al cargar la página
        quantitySelect.addEventListener("change", updatePrice);
        updatePrice();
    }
});

// 2. Manejo del botón de compra y envío a Google Sheets
document.addEventListener("DOMContentLoaded", () => {
    const buyButton = document.getElementById("buyButton");
    
    if (buyButton) {
        buyButton.addEventListener("click", async function(event) {
            event.preventDefault();

            // Capturar los valores directamente de los IDs de tu HTML
            const fullName = document.getElementById("fullName").value.trim();
            const userCedula = document.getElementById("userCedula").value.trim();
            const userPhone = document.getElementById("userPhone").value.trim();
            const userState = document.getElementById("userState").value;
            const ticketQuantity = document.getElementById("ticketQuantity").value;
            const sourceBank = document.getElementById("sourceBank").value;
            const paymentRef = document.getElementById("paymentRef").value.trim();
            const paymentReceipt = document.getElementById("paymentReceipt");

            // Validaciones de seguridad
            if (!fullName) {
                alert("Por favor ingresa tu Nombre y Apellido.");
                document.getElementById("fullName").focus();
                return;
            }
            if (!userCedula) {
                alert("Por favor ingresa tu Cédula de Identidad.");
                document.getElementById("userCedula").focus();
                return;
            }
            if (!userPhone) {
                alert("Por favor ingresa tu Teléfono o WhatsApp.");
                document.getElementById("userPhone").focus();
                return;
            }
            if (!userState) {
                alert("Por favor selecciona tu Estado de procedencia.");
                document.getElementById("userState").focus();
                return;
            }
            if (!paymentRef || paymentRef.length !== 4) {
                alert("La referencia de pago debe tener exactamente los últimos 4 dígitos.");
                document.getElementById("paymentRef").focus();
                return;
            }
            if (!paymentReceipt.files || paymentReceipt.files.length === 0) {
                alert("Por favor adjunta el capture del comprobante de pago.");
                paymentReceipt.focus();
                return;
            }

            const btn = buyButton;
            const originalText = btn.innerText;
            btn.innerText = "Procesando...";
            btn.disabled = true;

            // Construir los parámetros requeridos por Google Apps Script
            const queryParams = new URLSearchParams({
                fullName: fullName,
                userCedula: userCedula,
                userPhone: userPhone,
                userState: userState,
                ticketQuantity: ticketQuantity,
                sourceBank: sourceBank,
                paymentRef: paymentRef
            });

            try {
                // Envío mediante GET con no-cors
                await fetch(`${WEB_APP_URL}?${queryParams.toString()}`, {
                    method: "GET",
                    mode: "no-cors"
                });

                // Generar boletos aleatorios únicos para la previsualización
                const mockNumbers = generateRandomTickets(parseInt(ticketQuantity));
                
                setTimeout(() => {
                    showSuccessPopup({ fullName, userCedula, ticketQuantity }, mockNumbers);
                    btn.innerText = originalText;
                    btn.disabled = false;
                }, 1000);

            } catch (error) {
                console.error("Error al enviar los datos:", error);
                alert("Hubo un error al procesar la solicitud con el servidor.");
                btn.innerText = originalText;
                btn.disabled = false;
            }
        });
    }
});

// Función para generar números de boletos únicos de 4 dígitos
function generateRandomTickets(qty) {
    let nums = [];
    while(nums.length < qty) {
        let rand = ("0000" + Math.floor(Math.random() * 10000)).slice(-4);
        if(!nums.includes(rand)) nums.push(rand);
    }
    return nums.join(", ");
}

// Mostrar el modal de éxito con los datos del comprador
function showSuccessPopup(formData, assignedNumbers) {
    const modalName = document.getElementById('modalName');
    const modalCedula = document.getElementById('modalCedula');
    const modalQty = document.getElementById('modalQty');
    const modalNumbers = document.getElementById('modalNumbers');
    const successModal = document.getElementById('successModal');

    if (modalName) modalName.innerText = formData.fullName;
    if (modalCedula) modalCedula.innerText = formData.userCedula;
    if (modalQty) modalQty.innerText = formData.ticketQuantity;
    if (modalNumbers) modalNumbers.innerText = assignedNumbers;
    if (successModal) successModal.style.display = 'flex';
}

// Cerrar el modal y refrescar la página para actualizar el stock visible
function closeSuccessModal() {
    const successModal = document.getElementById('successModal');
    if (successModal) successModal.style.display = 'none';
    location.reload();
}
